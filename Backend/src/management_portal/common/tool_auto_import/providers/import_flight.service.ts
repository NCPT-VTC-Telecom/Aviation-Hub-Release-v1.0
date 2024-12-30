import { faker } from "@faker-js/faker";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { Aircraft } from "src/management_portal/flights/entity/aircraft.entity";
import { Flights } from "src/management_portal/flights/entity/flights.entity";
import { Between, In, Not, Repository } from "typeorm";

@Injectable()
export class ImportFlightService {
  private readonly averageSpeedKph = 800; // Average speed in km/h
  private startIndex = 0;

  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Flights)
    private readonly flightsRepository: Repository<Flights>,
    @InjectRepository(Aircraft)
    private readonly aircraftRepository: Repository<Aircraft>
  ) {}

  private generateCoordinates(): { lat: number; lon: number } {
    return {
      lat: faker.location.latitude(),
      lon: faker.location.longitude(),
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private generateLogicalTimes(departureTime: Date, distance: number): { departureTime: Date; arrivalTime: Date } {
    const travelTimeInHours = distance / this.averageSpeedKph;
    const arrivalTime = new Date(departureTime.getTime() + travelTimeInHours * 3600000); // Convert hours to milliseconds

    return { departureTime, arrivalTime };
  }

  private async flightExistsForDay(aircraftId: number, date: Date): Promise<Flights | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if there are any flights for the given aircraft within the same day
    return await this.flightsRepository.findOne({
      where: {
        aircraft_id: aircraftId,
        departure_time: Between(startOfDay, endOfDay),
        arrival_time: Between(startOfDay, endOfDay),
        status_id: Not(In([13, 19])),
      },
    });
  }

  async updateFlightPhase(): Promise<void> {
    try {
      const flights = await this.flightsRepository.find({
        where: {
          status_id: Not(In([13, 19])),
        },
      });
      for (const flight of flights) {
        let newPhase = parseInt(flight.flight_phase, 10) + 1;
        if (newPhase > 11) newPhase = 1;
        flight.flight_phase = newPhase.toString();

        flight.status_id = this.getStatusId(newPhase);

        flight.lat_location = this.getRandomLatitudeInRange().toString();
        flight.long_location = this.getRandomLongitudeInRange().toString();
        flight.altitude = this.getAltitudeFromFlightPhase(newPhase);

        await this.flightsRepository.save(flight);
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException("Failed to update flight phase");
    }
  }

  private async createNewFlight(aircraft: Aircraft, departureTime: Date): Promise<void> {
    const departureCity = faker.location.city();
    const arrivalCity = faker.location.city();

    const departureCoordinates = this.generateCoordinates();
    const arrivalCoordinates = this.generateCoordinates();

    const distance = this.calculateDistance(departureCoordinates.lat, departureCoordinates.lon, arrivalCoordinates.lat, arrivalCoordinates.lon);

    const arrivalTime = new Date(departureTime.getTime() + 5 * 60 * 60 * 1000);
    const IdAircraft = aircraft.id;
    const newFlight = await this.flightsRepository.create({
      aircraft_id: IdAircraft,
      departure_airport: departureCity,
      arrival_airport: arrivalCity,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      flight_phase: "1",
      airline: "Vietnam Airline",
      status_id: 14,
      lat_location: this.getRandomLatitudeInRange().toString(),
      long_location: this.getRandomLongitudeInRange().toString(),
      altitude: this.getAltitudeFromFlightPhase(1),
    });
    const addFLight = await this.flightsRepository.save(newFlight);

    await this.aircraftRepository.update(IdAircraft, {
      flight_number: `VN-${addFLight.id}-${IdAircraft}`,
    });
  }

  async handleImportFlight(): Promise<void> {
    try {
      const aircrafts = await this.aircraftRepository.find({ where: { status_id: Not(In([13, 19])) } });
      const totalAircrafts = aircrafts.length;
      // Aircraft Per House
      const flightsPerHour = 1;

      let existFLight = [];
      // Get 21 Aircraft form start Index
      let selectedAircrafts = aircrafts.slice(this.startIndex, this.startIndex + flightsPerHour);

      if (this.startIndex + flightsPerHour > totalAircrafts) {
        const remainingCount = flightsPerHour - (totalAircrafts - this.startIndex);
        selectedAircrafts = [...selectedAircrafts, ...aircrafts.slice(0, remainingCount)];
      }
      for (const aircraft of selectedAircrafts) {
        const startHour = new Date();
        const existingFlight = await this.flightExistsForDay(aircraft.id, startHour);

        if (existingFlight === null) {
          const flightStartTime = new Date(startHour.getTime() + (60 / flightsPerHour) * 60 * 1000);
          await this.createNewFlight(aircraft, flightStartTime);
        } else {
          existFLight.push(existingFlight);
        }
      }

      // Update Index for next loop
      this.startIndex = (this.startIndex + flightsPerHour) % totalAircrafts;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException("Failed to import flight data");
    }
  }

  private getStatusId(flightPhase: number): number {
    return flightPhase === 1 || flightPhase === 11 ? 19 : 14;
  }

  private getRandomLatitudeInRange(): number {
    const minLatitude = 10.7769;
    const maxLatitude = 21.0285;
    return Math.random() * (maxLatitude - minLatitude) + minLatitude;
  }

  private getRandomLongitudeInRange(): number {
    const minLongitude = 103.984;
    const maxLongitude = 108.2022;
    return Math.random() * (maxLongitude - minLongitude) + minLongitude;
  }

  private getAltitudeFromFlightPhase(flightPhase: number): string {
    switch (flightPhase) {
      case 1:
        return "0";
      case 2:
        return "0";
      case 3:
        return "1500";
      case 4:
        return "1000";
      case 5:
        return "35000";
      case 6:
        return "40000";
      case 7:
        return "10000";
      case 8:
        return "10000";
      case 9:
        return "3000";
      case 10:
        return "0";
      case 11:
        return "0";
    }
  }
}
