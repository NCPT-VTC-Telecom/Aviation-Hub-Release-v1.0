import { Test, TestingModule } from "@nestjs/testing";
import { SessionService } from "src/management_portal/sessions/providers/session.service";
import { Repository, SelectQueryBuilder } from "typeorm";
import { SessionDetails, Sessions, UserSessionActivities, FindSessionDetails } from "src/management_portal/sessions/entity/session.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { InternalServerErrorException } from "@nestjs/common";
import { responseMessage } from "src/utils/constant";

describe("SessionService", () => {
  let service: SessionService;
  let sessionDetailsRepository: Repository<SessionDetails>;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        LoggerService,
        {
          provide: getRepositoryToken(SessionDetails),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Sessions),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserSessionActivities),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(FindSessionDetails),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    sessionDetailsRepository = module.get<Repository<SessionDetails>>(getRepositoryToken(SessionDetails));
    loggerService = await module.resolve<LoggerService>(LoggerService); // Use resolve instead of get
  });

  it("should return session details with pagination and filtering", async () => {
    // Mocking data to be returned from the repository
    const mockSessionDetails = [
      {
        id: 1,
        start_time: new Date(),
        stop_time: new Date(),
        session: {
          id: 1,
          user: {
            id: 1,
            fullname: "John Doe",
            email: "john@example.com",
            phone_number: "123456789",
            username: "johndoe",
            status_id: 1,
          },
          flight: {
            departure_airport: "LAX",
            arrival_airport: "JFK",
            aircraft: {
              id: 1,
              tail_number: "ABC123",
              flight_number: "VN123",
            },
          },
          device: {
            id: 1,
            name: "Device 1",
          },
          product: {},
        },
        session_catalog: {
          id: 1,
          name: "Catalog 1",
        },
      },
    ];

    // Mock query result
    jest.spyOn(sessionDetailsRepository, "createQueryBuilder").mockImplementation(() => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockSessionDetails, 1]),
      } as unknown as SelectQueryBuilder<SessionDetails>;

      return queryBuilder;
    });

    const result = await service.findSessionDetails(1, 10, "John");

    expect(result).toEqual({
      data: expect.any(Array),
      total: 1,
      totalPages: 1,
    });
  });

  it("should throw an InternalServerErrorException when an error occurs", async () => {
    // Simulate error
    jest.spyOn(sessionDetailsRepository, "createQueryBuilder").mockImplementation(() => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockRejectedValue(new Error("Database error")), // Use mockRejectedValue
      } as unknown as SelectQueryBuilder<SessionDetails>;

      return queryBuilder;
    });

    jest.spyOn(loggerService, "error").mockImplementation(() => {});

    await expect(service.findSessionDetails(1, 10, "John")).rejects.toThrow(InternalServerErrorException);
    expect(loggerService.error).toHaveBeenCalledWith(responseMessage.serviceError, expect.any(Error)); // Ensure logger is called
  });
});
