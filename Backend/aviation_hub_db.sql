USE [master]
GO
/****** Object:  Database [aviation_hub]    Script Date: 12/30/2024 11:14:57 AM ******/
CREATE DATABASE [aviation_hub]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'aviation_hub', FILENAME = N'C:\DataBackup\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\aviation_hub.mdf' , SIZE = 4333568KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'aviation_hub_log', FILENAME = N'C:\DataBackup\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\aviation_hub_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [aviation_hub] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [aviation_hub].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [aviation_hub] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [aviation_hub] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [aviation_hub] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [aviation_hub] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [aviation_hub] SET ARITHABORT OFF 
GO
ALTER DATABASE [aviation_hub] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [aviation_hub] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [aviation_hub] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [aviation_hub] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [aviation_hub] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [aviation_hub] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [aviation_hub] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [aviation_hub] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [aviation_hub] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [aviation_hub] SET  DISABLE_BROKER 
GO
ALTER DATABASE [aviation_hub] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [aviation_hub] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [aviation_hub] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [aviation_hub] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [aviation_hub] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [aviation_hub] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [aviation_hub] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [aviation_hub] SET RECOVERY FULL 
GO
ALTER DATABASE [aviation_hub] SET  MULTI_USER 
GO
ALTER DATABASE [aviation_hub] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [aviation_hub] SET DB_CHAINING OFF 
GO
ALTER DATABASE [aviation_hub] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [aviation_hub] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [aviation_hub] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [aviation_hub] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'aviation_hub', N'ON'
GO
ALTER DATABASE [aviation_hub] SET QUERY_STORE = OFF
GO
USE [aviation_hub]
GO
/****** Object:  Table [dbo].[aircraft]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[aircraft](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[flight_number] [nvarchar](50) NULL,
	[tail_number] [nvarchar](50) NULL,
	[model] [nvarchar](50) NULL,
	[manufacturer] [nvarchar](255) NULL,
	[model_type] [nvarchar](255) NULL,
	[capacity] [int] NULL,
	[leased_aircraft_status] [nvarchar](50) NULL,
	[year_manufactured] [datetime] NULL,
	[ownership] [nvarchar](50) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[img_link] [nvarchar](1000) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[airlines]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[airlines](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](255) NULL,
	[description] [nvarchar](500) NULL,
	[code] [nvarchar](500) NULL,
	[token_code] [nvarchar](max) NULL,
	[country] [nvarchar](50) NULL,
	[email] [nvarchar](255) NULL,
	[phone_number] [nvarchar](12) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[api_callback_request]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[api_callback_request](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[request_url] [nvarchar](500) NULL,
	[request_method] [nvarchar](50) NULL,
	[request_data] [nvarchar](max) NULL,
	[request_time_UTC] [datetime] NULL,
	[request_content_type] [nvarchar](250) NULL,
	[request_ip_address] [nvarchar](50) NULL,
	[request_user_agent] [nvarchar](500) NULL,
	[response_status_code] [nvarchar](10) NULL,
	[response_content] [nvarchar](max) NULL,
	[response_time_UTC] [datetime] NULL,
	[response_ip_address] [nvarchar](50) NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[api_radius_request]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[api_radius_request](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](250) NULL,
	[request_body] [nvarchar](max) NULL,
	[request_headers] [nvarchar](max) NULL,
	[request_url] [nvarchar](max) NULL,
	[response_message] [nvarchar](250) NULL,
	[response_reason] [nvarchar](max) NULL,
	[created_date] [datetime] NULL,
	[request_ip_address] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[audit_log]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[audit_log](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[action_type] [nvarchar](50) NULL,
	[table_name] [nvarchar](50) NULL,
	[request_content] [nvarchar](max) NULL,
	[action_time] [datetime] NULL,
	[old_data] [nvarchar](max) NULL,
	[new_data] [nvarchar](max) NULL,
	[created_date] [datetime] NULL,
	[ipaddress] [nvarchar](25) NULL,
	[user_agent] [nvarchar](500) NULL,
	[response_content] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[billing_activities]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[billing_activities](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[billing_id] [uniqueidentifier] NULL,
	[status_id] [int] NULL,
	[billing_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[billings]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[billings](
	[id] [uniqueidentifier] NOT NULL,
	[billing_number] [nvarchar](250) NULL,
	[total_quantity] [int] NULL,
	[total] [decimal](18, 2) NULL,
	[status_id] [int] NULL,
	[billing_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[blacklist_categories]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[blacklist_categories](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](100) NULL,
	[name] [nvarchar](500) NULL,
	[description] [nvarchar](500) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[blacklist_devices]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[blacklist_devices](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[device_name] [nvarchar](500) NULL,
	[mac_address] [nvarchar](50) NULL,
	[device_type] [nvarchar](100) NULL,
	[reason] [nvarchar](500) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[ip_address] [nvarchar](50) NULL,
	[ipv6_address] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[blacklist_domains]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[blacklist_domains](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](500) NULL,
	[url] [nvarchar](500) NULL,
	[ip_address] [nvarchar](50) NULL,
	[ipv6_address] [nvarchar](100) NULL,
	[dns_address] [nvarchar](50) NULL,
	[reason] [nvarchar](500) NULL,
	[category_id] [int] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[campaign]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[campaign](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](255) NULL,
	[description] [nvarchar](max) NULL,
	[status_id] [int] NULL,
	[start_date] [datetime] NULL,
	[end_date] [datetime] NULL,
	[budget] [decimal](18, 2) NULL,
	[created_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[deleted_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[campaign_details]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[campaign_details](
	[id] [uniqueidentifier] NOT NULL,
	[campaign_id] [uniqueidentifier] NULL,
	[product_id] [int] NULL,
	[quantity] [int] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[customer_service_request]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[customer_service_request](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[request_number] [nvarchar](255) NULL,
	[title_sender] [nvarchar](255) NULL,
	[body_sender] [nvarchar](max) NULL,
	[user_sender_id] [uniqueidentifier] NOT NULL,
	[status_id] [int] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[user_receiver_id] [uniqueidentifier] NULL,
	[body_receiver] [nvarchar](max) NULL,
	[label] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[customer_service_request_hist]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[customer_service_request_hist](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[request_id] [int] NULL,
	[title_sender] [nvarchar](255) NULL,
	[body_sender] [nvarchar](max) NULL,
	[body_receiver] [nvarchar](max) NULL,
	[status_id] [int] NULL,
	[error_description] [nvarchar](max) NULL,
	[created_date] [datetime] NULL,
	[label] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[device_alerts]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[device_alerts](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[deivce_id] [uniqueidentifier] NULL,
	[alert_time] [datetime] NULL,
	[alert_type] [nvarchar](50) NULL,
	[severity] [nvarchar](250) NULL,
	[description] [nvarchar](500) NULL,
	[resolved] [nvarchar](250) NULL,
	[resolved_time] [datetime] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[device_details]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[device_details](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[device_id] [uniqueidentifier] NULL,
	[ip_address] [nvarchar](50) NULL,
	[last_ip] [nvarchar](50) NULL,
	[port] [nvarchar](10) NULL,
	[mac_address] [nvarchar](50) NULL,
	[ipv6_address] [nvarchar](50) NULL,
	[firmware] [nvarchar](250) NULL,
	[wifi_standard] [nvarchar](50) NULL,
	[manufacturer] [nvarchar](250) NULL,
	[manufacturer_date] [datetime] NULL,
	[model] [nvarchar](250) NULL,
	[cpu_type] [nvarchar](250) NULL,
	[supplier] [nvarchar](250) NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[device_health]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[device_health](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[device_id] [uniqueidentifier] NULL,
	[status] [varchar](200) NULL,
	[cpu_usage] [float] NULL,
	[memory_usage] [float] NULL,
	[disk_usage] [float] NULL,
	[temperature] [float] NULL,
	[created_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[device_health_activities]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[device_health_activities](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[device_id] [uniqueidentifier] NULL,
	[check_time] [datetime] NULL,
	[status] [nvarchar](50) NULL,
	[cpu_usage] [float] NULL,
	[memory_usage] [float] NULL,
	[disk_usage] [float] NULL,
	[temperature] [nvarchar](10) NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[device_type]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[device_type](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NULL,
	[description] [nvarchar](500) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[devices]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[devices](
	[id] [uniqueidentifier] NOT NULL,
	[type_id] [int] NULL,
	[aircraft_id] [int] NULL,
	[name] [nvarchar](250) NULL,
	[description] [nvarchar](500) NULL,
	[date_of_manufacture] [datetime] NULL,
	[placement_location] [nvarchar](250) NULL,
	[activation_date] [datetime] NULL,
	[deactivation_date] [datetime] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[devices_health_tracking]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[devices_health_tracking](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[device_id] [uniqueidentifier] NULL,
	[ping_rate_success] [int] NULL,
	[packet_loss_rate] [int] NULL,
	[check_time] [datetime] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[discount]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[discount](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NULL,
	[quantity] [int] NULL,
	[quantity_per_user] [int] NULL,
	[date_from] [datetime] NULL,
	[minimal] [decimal](18, 2) NULL,
	[maximal] [decimal](18, 2) NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[code] [nvarchar](255) NULL,
	[type] [nvarchar](255) NULL,
	[date_end] [datetime] NULL,
	[status_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[flight_session]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[flight_session](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[session_id] [uniqueidentifier] NULL,
	[start_time] [datetime] NULL,
	[end_time] [datetime] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[flight_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[flights]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[flights](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[aircraft_id] [int] NULL,
	[departure_airport] [nvarchar](255) NULL,
	[arrival_airport] [nvarchar](255) NULL,
	[departure_time] [datetime] NULL,
	[arrival_time] [datetime] NULL,
	[flight_phase] [nvarchar](255) NULL,
	[airline] [nvarchar](255) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[lat_location] [nvarchar](250) NULL,
	[long_location] [nvarchar](250) NULL,
	[altitude] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[fulfillment_status]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[fulfillment_status](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](25) NULL,
	[description] [nvarchar](500) NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gateways]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gateways](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](250) NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](500) NULL,
	[value] [nvarchar](max) NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[status_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[geolocation]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[geolocation](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](50) NULL,
	[name] [nvarchar](50) NULL,
	[type] [nvarchar](50) NULL,
	[parent_id] [int] NULL,
	[created_by] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[group_role]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[group_role](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](255) NULL,
	[description] [nvarchar](500) NULL,
	[permission] [nvarchar](500) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[level] [int] NULL,
	[access] [nvarchar](100) NULL,
	[parent_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[IFC_service_metrics]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[IFC_service_metrics](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[device_id] [uniqueidentifier] NULL,
	[flight_id] [int] NULL,
	[speed] [float] NULL,
	[latency] [int] NULL,
	[bandwidth_usage] [float] NULL,
	[packet_loss_rate] [float] NULL,
	[connection_quality] [int] NULL,
	[uptime] [bigint] NULL,
	[downtime] [bigint] NULL,
	[unauthorized_access_attempts] [int] NULL,
	[failed_connections] [int] NULL,
	[concurrent_users] [int] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[maintenance_aircrafts]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[maintenance_aircrafts](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[aircraft_id] [int] NULL,
	[maintenance_status] [nvarchar](255) NULL,
	[created_by] [int] NULL,
	[update_by] [int] NULL,
	[description] [nvarchar](500) NULL,
	[reason] [nvarchar](500) NULL,
	[from_date] [datetime] NULL,
	[end_date] [datetime] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[maintenance_code] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[maintenance_aircrafts_hist]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[maintenance_aircrafts_hist](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[maintenance_id] [int] NULL,
	[maintenance_status] [nvarchar](255) NULL,
	[from_date] [datetime] NULL,
	[end_date] [datetime] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[maintenance_devices]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[maintenance_devices](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[device_id] [uniqueidentifier] NULL,
	[maintenance_status] [nvarchar](255) NULL,
	[created_by] [int] NULL,
	[update_by] [int] NULL,
	[description] [nvarchar](500) NULL,
	[reason] [nvarchar](500) NULL,
	[from_date] [datetime] NULL,
	[end_date] [datetime] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[maintenance_code] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[maintenance_devices_hist]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[maintenance_devices_hist](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[maintenance_id] [int] NULL,
	[maintenance_status] [nvarchar](255) NULL,
	[from_date] [nvarchar](255) NULL,
	[end_date] [nvarchar](500) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[order_details]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order_details](
	[id] [uniqueidentifier] NOT NULL,
	[order_id] [uniqueidentifier] NULL,
	[product_id] [int] NULL,
	[quantity] [int] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[order_discount]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order_discount](
	[id] [uniqueidentifier] NOT NULL,
	[order_id] [uniqueidentifier] NULL,
	[discount_id] [int] NULL,
	[quantity] [int] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orders]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orders](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[billing_id] [uniqueidentifier] NULL,
	[transaction_id] [uniqueidentifier] NULL,
	[gateway_id] [int] NULL,
	[flight_id] [int] NULL,
	[order_number] [nvarchar](255) NULL,
	[subtotal] [decimal](18, 2) NULL,
	[total_quantity] [int] NULL,
	[total_discount] [decimal](18, 2) NULL,
	[tax_fee] [decimal](18, 2) NULL,
	[total] [decimal](18, 2) NULL,
	[shipping_method] [nvarchar](50) NULL,
	[note] [nvarchar](500) NULL,
	[vouchers] [nvarchar](500) NULL,
	[payment_status_id] [int] NULL,
	[fulfillment_status_id] [int] NULL,
	[status_id] [int] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[sale_channels_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[payment_status]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payment_status](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](25) NULL,
	[description] [nvarchar](500) NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product_permission]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product_permission](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[product_id] [int] NULL,
	[group_role_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product_price]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product_price](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[product_id] [int] NULL,
	[original_price] [decimal](18, 2) NULL,
	[new_price] [decimal](18, 2) NULL,
	[currency] [nvarchar](10) NULL,
	[start_date] [datetime] NULL,
	[end_date] [datetime] NULL,
	[created_by] [int] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
 CONSTRAINT [PK__product___3213E83F2C3F6DC2] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[products]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[products](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[price_id] [int] NULL,
	[image_link] [nvarchar](255) NULL,
	[title] [nvarchar](255) NULL,
	[description] [nvarchar](500) NULL,
	[type] [nvarchar](50) NULL,
	[total_time] [float] NULL,
	[bandwidth_upload] [float] NULL,
	[bandwidth_download] [float] NULL,
	[data_total] [float] NULL,
	[data_upload] [float] NULL,
	[data_download] [float] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[products_plane_ticket]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[products_plane_ticket](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](250) NULL,
	[sku] [nvarchar](250) NULL,
	[ticket_plan] [nvarchar](250) NULL,
	[product_id] [int] NULL,
	[description] [nvarchar](max) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
 CONSTRAINT [PK__product___3213E83FF33F2189] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[products_telecom]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[products_telecom](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](250) NULL,
	[sku] [nvarchar](250) NULL,
	[ticket_plan] [nvarchar](250) NULL,
	[product_id] [int] NULL,
	[product_type] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
 CONSTRAINT [PK__products__3213E83FF3AA747A] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sale_channels]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sale_channels](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](250) NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](500) NULL,
	[value] [nvarchar](max) NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[status_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[session_catalog]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[session_catalog](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NULL,
	[description] [nvarchar](500) NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[session_details]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[session_details](
	[id] [uniqueidentifier] NOT NULL,
	[session_id] [uniqueidentifier] NULL,
	[session_catalog_id] [int] NULL,
	[start_time] [datetime] NULL,
	[stop_time] [datetime] NULL,
	[user_ip_address] [nvarchar](250) NULL,
	[user_mac_address] [nvarchar](250) NULL,
	[data_usage_mb] [decimal](8, 3) NULL,
	[average_speed_mbps] [float] NULL,
	[bytes_transferred] [float] NULL,
	[bytes_received] [float] NULL,
	[url] [nvarchar](250) NULL,
	[destination_ip] [nvarchar](250) NULL,
	[connection_quality] [nvarchar](250) NULL,
	[domain] [nvarchar](250) NULL,
	[port] [nvarchar](250) NULL,
	[user_agent] [nvarchar](250) NULL,
	[referrer] [nvarchar](250) NULL,
	[response_time_ms] [float] NULL,
	[ssl_version] [nvarchar](50) NULL,
	[protocol] [nvarchar](50) NULL,
	[status_id] [int] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[duration_time] [int] NULL,
	[index_column] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sessions]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sessions](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[voucher_id] [uniqueidentifier] NULL,
	[flight_id] [int] NULL,
	[product_id] [int] NULL,
	[total_data_pending] [decimal](10, 4) NULL,
	[total_data_usage] [decimal](10, 4) NULL,
	[total_data_upload] [decimal](10, 4) NULL,
	[total_data_download] [decimal](10, 4) NULL,
	[total_time_usage_hour] [decimal](10, 4) NULL,
	[session_status] [nvarchar](255) NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[device_id] [uniqueidentifier] NULL,
	[user_device] [nvarchar](50) NULL,
	[acct_session_id] [nvarchar](250) NULL,
	[acct_authentic] [nvarchar](250) NULL,
	[acct_multisession_id] [nvarchar](250) NULL,
	[terminate_reason] [nvarchar](250) NULL,
	[user_mac_address] [nvarchar](250) NULL,
	[user_ip_address] [nvarchar](250) NULL,
	[type_session] [nvarchar](250) NULL,
 CONSTRAINT [PK__sessions__3213E83FA3568421] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[status]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[status](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](50) NULL,
	[description] [nvarchar](500) NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[type] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[supplier]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[supplier](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](255) NULL,
	[description] [nvarchar](500) NULL,
	[address] [nvarchar](max) NULL,
	[contact] [nvarchar](500) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[type] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tax_rate]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tax_rate](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](250) NULL,
	[type] [nvarchar](50) NULL,
	[fee] [decimal](18, 2) NULL,
	[rate] [int] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[telecom_redeem]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[telecom_redeem](
	[id] [uniqueidentifier] NOT NULL,
	[phone_number] [nvarchar](25) NULL,
	[user_id] [uniqueidentifier] NULL,
	[flight_id] [int] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ticket_vna]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ticket_vna](
	[id] [uniqueidentifier] NOT NULL,
	[serial] [nvarchar](500) NULL,
	[user_id] [uniqueidentifier] NULL,
	[flight_id] [int] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[transaction_activities]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[transaction_activities](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[transaction_id] [uniqueidentifier] NULL,
	[status_id] [int] NULL,
	[billing_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[transactions]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[transactions](
	[id] [uniqueidentifier] NOT NULL,
	[subtotal] [decimal](18, 2) NULL,
	[total] [decimal](18, 2) NULL,
	[status_id] [int] NULL,
	[transaction_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_acct_temp]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_acct_temp](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](250) NULL,
	[client_mac] [nvarchar](200) NULL,
	[sip] [nvarchar](20) NULL,
	[timestamp] [datetime] NULL,
	[created_date] [datetime] NULL,
	[login_status] [nvarchar](50) NULL,
	[flight_id] [int] NULL,
	[device_id] [nvarchar](500) NULL,
	[product_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_activities]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_activities](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[session_id] [uniqueidentifier] NULL,
	[device_id] [uniqueidentifier] NULL,
	[flight_id] [int] NULL,
	[start_time] [datetime] NULL,
	[end_time] [datetime] NULL,
	[status_id] [int] NULL,
	[total_data_usage_mb] [decimal](18, 2) NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_group]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_group](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[group_id] [int] NULL,
	[user_id] [uniqueidentifier] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_group_lv2]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_group_lv2](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[group_id_lv1] [int] NULL,
	[group_id_lv2] [int] NULL,
	[user_id] [uniqueidentifier] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_group_lv3]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_group_lv3](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[group_id_lv1] [int] NULL,
	[group_id_lv2] [int] NULL,
	[group_id_lv3] [int] NULL,
	[user_id] [uniqueidentifier] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_login_hist]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_login_hist](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[access_token] [nvarchar](max) NULL,
	[type] [nvarchar](50) NULL,
	[login_count] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[last_time] [datetime] NULL,
	[access_time] [datetime] NULL,
	[ipaddress] [nvarchar](25) NULL,
	[user_agent] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_vendor]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_vendor](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[description] [nvarchar](500) NULL,
	[token] [nvarchar](500) NULL,
	[expired_date] [datetime] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[ip_addresses] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [uniqueidentifier] NOT NULL,
	[image_link] [nvarchar](500) NULL,
	[fullname] [nvarchar](500) NULL,
	[email] [nvarchar](500) NULL,
	[phone_number] [nvarchar](50) NULL,
	[citizen_id] [nvarchar](50) NULL,
	[gender] [nvarchar](10) NULL,
	[address] [nvarchar](255) NULL,
	[ward] [nvarchar](50) NULL,
	[district] [nvarchar](50) NULL,
	[province] [nvarchar](50) NULL,
	[country] [nvarchar](50) NULL,
	[postcode] [nvarchar](50) NULL,
	[username] [nvarchar](50) NULL,
	[password] [nvarchar](255) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[voucher_systems]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[voucher_systems](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NULL,
	[description] [nvarchar](500) NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
 CONSTRAINT [PK_voucher_systems] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[vouchers]    Script Date: 12/30/2024 11:14:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[vouchers](
	[id] [uniqueidentifier] NOT NULL,
	[campaign_id] [uniqueidentifier] NULL,
	[voucher_code] [nvarchar](255) NULL,
	[created_by] [int] NULL,
	[type] [nvarchar](255) NULL,
	[user_id] [uniqueidentifier] NULL,
	[from_date] [datetime] NULL,
	[end_date] [datetime] NULL,
	[product_id] [int] NULL,
	[status_id] [int] NULL,
	[deleted_date] [datetime] NULL,
	[modified_date] [datetime] NULL,
	[created_date] [datetime] NULL,
	[request_id] [nvarchar](255) NULL,
 CONSTRAINT [PK__vouchers__3213E83FD7527A1F] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [idx_domain_url]    Script Date: 12/30/2024 11:14:59 AM ******/
CREATE NONCLUSTERED INDEX [idx_domain_url] ON [dbo].[session_details]
(
	[domain] ASC,
	[url] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [idx_start_time]    Script Date: 12/30/2024 11:14:59 AM ******/
CREATE NONCLUSTERED INDEX [idx_start_time] ON [dbo].[session_details]
(
	[start_time] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [session_details_index]    Script Date: 12/30/2024 11:14:59 AM ******/
CREATE NONCLUSTERED INDEX [session_details_index] ON [dbo].[session_details]
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[aircraft] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[airlines] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[airlines] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[api_callback_request] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[api_radius_request] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[audit_log] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[billing_activities] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[billings] ADD  CONSTRAINT [DF_Billings_Id]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[billings] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[blacklist_categories] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[blacklist_devices] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[blacklist_domains] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[campaign] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[campaign] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[campaign_details] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[campaign_details] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[customer_service_request] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[customer_service_request_hist] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[device_alerts] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[device_details] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[device_health] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[device_health_activities] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[device_type] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[devices] ADD  CONSTRAINT [DF_Devices_Id]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[devices] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[devices_health_tracking] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[discount] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[flight_session] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[flights] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[fulfillment_status] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[gateways] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[geolocation] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[group_role] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[IFC_service_metrics] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[maintenance_aircrafts] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[maintenance_aircrafts_hist] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[maintenance_devices] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[maintenance_devices_hist] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[order_details] ADD  CONSTRAINT [DF_Order_Details_Id]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[order_details] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[order_discount] ADD  CONSTRAINT [DF_Order_Discount_Id]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[order_discount] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[orders] ADD  CONSTRAINT [DF_Orders_Id]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[payment_status] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[product_permission] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[product_price] ADD  CONSTRAINT [DF__product_p__creat__09A971A2]  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[products] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[products_plane_ticket] ADD  CONSTRAINT [DF__product_p__creat__7908F585]  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[products_telecom] ADD  CONSTRAINT [DF__products___creat__7BE56230]  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[sale_channels] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[session_catalog] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[session_details] ADD  CONSTRAINT [DF_Sessions_Details_Id]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[session_details] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[sessions] ADD  CONSTRAINT [DF_Sessions_Id]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[sessions] ADD  CONSTRAINT [DF__sessions__create__1AD3FDA4]  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[status] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[supplier] ADD  CONSTRAINT [DF_Supplier_ID]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[supplier] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[tax_rate] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[telecom_redeem] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[telecom_redeem] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[ticket_vna] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[ticket_vna] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[transaction_activities] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[transactions] ADD  CONSTRAINT [DF_Transactions_Id]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[transactions] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[user_acct_temp] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[user_activities] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[user_group] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[user_group_lv2] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[user_group_lv3] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[user_login_hist] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[user_vendor] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[user_vendor] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[users] ADD  CONSTRAINT [DF_Users_Id]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[voucher_systems] ADD  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[vouchers] ADD  CONSTRAINT [DF__vouchers__id__318258D2]  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[vouchers] ADD  CONSTRAINT [DF__vouchers__create__32767D0B]  DEFAULT (getdate()) FOR [created_date]
GO
ALTER TABLE [dbo].[aircraft]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[airlines]  WITH CHECK ADD  CONSTRAINT [fk_status_airline] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[airlines] CHECK CONSTRAINT [fk_status_airline]
GO
ALTER TABLE [dbo].[billing_activities]  WITH CHECK ADD FOREIGN KEY([billing_id])
REFERENCES [dbo].[billings] ([id])
GO
ALTER TABLE [dbo].[billing_activities]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[billings]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[blacklist_categories]  WITH CHECK ADD  CONSTRAINT [fk_status_category] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[blacklist_categories] CHECK CONSTRAINT [fk_status_category]
GO
ALTER TABLE [dbo].[blacklist_devices]  WITH CHECK ADD  CONSTRAINT [fk_status_devices] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[blacklist_devices] CHECK CONSTRAINT [fk_status_devices]
GO
ALTER TABLE [dbo].[blacklist_domains]  WITH CHECK ADD  CONSTRAINT [fk_category] FOREIGN KEY([category_id])
REFERENCES [dbo].[blacklist_categories] ([id])
GO
ALTER TABLE [dbo].[blacklist_domains] CHECK CONSTRAINT [fk_category]
GO
ALTER TABLE [dbo].[blacklist_domains]  WITH CHECK ADD  CONSTRAINT [fk_status_domain] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[blacklist_domains] CHECK CONSTRAINT [fk_status_domain]
GO
ALTER TABLE [dbo].[customer_service_request]  WITH CHECK ADD FOREIGN KEY([user_sender_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[customer_service_request_hist]  WITH CHECK ADD FOREIGN KEY([request_id])
REFERENCES [dbo].[customer_service_request] ([id])
GO
ALTER TABLE [dbo].[device_alerts]  WITH CHECK ADD FOREIGN KEY([deivce_id])
REFERENCES [dbo].[devices] ([id])
GO
ALTER TABLE [dbo].[device_details]  WITH CHECK ADD FOREIGN KEY([device_id])
REFERENCES [dbo].[devices] ([id])
GO
ALTER TABLE [dbo].[device_health_activities]  WITH CHECK ADD FOREIGN KEY([device_id])
REFERENCES [dbo].[devices] ([id])
GO
ALTER TABLE [dbo].[devices]  WITH CHECK ADD FOREIGN KEY([aircraft_id])
REFERENCES [dbo].[aircraft] ([id])
GO
ALTER TABLE [dbo].[devices]  WITH CHECK ADD FOREIGN KEY([type_id])
REFERENCES [dbo].[device_type] ([id])
GO
ALTER TABLE [dbo].[devices]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[devices_health_tracking]  WITH CHECK ADD  CONSTRAINT [FK_DevicesHealthTracking_Device] FOREIGN KEY([device_id])
REFERENCES [dbo].[devices] ([id])
GO
ALTER TABLE [dbo].[devices_health_tracking] CHECK CONSTRAINT [FK_DevicesHealthTracking_Device]
GO
ALTER TABLE [dbo].[devices_health_tracking]  WITH CHECK ADD  CONSTRAINT [FK_DevicesHealthTracking_Status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[devices_health_tracking] CHECK CONSTRAINT [FK_DevicesHealthTracking_Status]
GO
ALTER TABLE [dbo].[discount]  WITH CHECK ADD  CONSTRAINT [FK_Discount_Status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[discount] CHECK CONSTRAINT [FK_Discount_Status]
GO
ALTER TABLE [dbo].[flight_session]  WITH CHECK ADD  CONSTRAINT [FK__flight_se__creat__29221CFB] FOREIGN KEY([session_id])
REFERENCES [dbo].[sessions] ([id])
GO
ALTER TABLE [dbo].[flight_session] CHECK CONSTRAINT [FK__flight_se__creat__29221CFB]
GO
ALTER TABLE [dbo].[flight_session]  WITH CHECK ADD  CONSTRAINT [FK_flight_session_flight_id] FOREIGN KEY([flight_id])
REFERENCES [dbo].[flights] ([id])
GO
ALTER TABLE [dbo].[flight_session] CHECK CONSTRAINT [FK_flight_session_flight_id]
GO
ALTER TABLE [dbo].[flights]  WITH CHECK ADD FOREIGN KEY([aircraft_id])
REFERENCES [dbo].[aircraft] ([id])
GO
ALTER TABLE [dbo].[flights]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[gateways]  WITH CHECK ADD  CONSTRAINT [FK_gateways_status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[gateways] CHECK CONSTRAINT [FK_gateways_status]
GO
ALTER TABLE [dbo].[geolocation]  WITH CHECK ADD FOREIGN KEY([parent_id])
REFERENCES [dbo].[geolocation] ([id])
GO
ALTER TABLE [dbo].[group_role]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[group_role]  WITH CHECK ADD  CONSTRAINT [FK_GroupRole_ParentId] FOREIGN KEY([parent_id])
REFERENCES [dbo].[group_role] ([id])
GO
ALTER TABLE [dbo].[group_role] CHECK CONSTRAINT [FK_GroupRole_ParentId]
GO
ALTER TABLE [dbo].[maintenance_aircrafts]  WITH CHECK ADD  CONSTRAINT [FK_MaintenanceAircraft_Aircraft] FOREIGN KEY([aircraft_id])
REFERENCES [dbo].[aircraft] ([id])
GO
ALTER TABLE [dbo].[maintenance_aircrafts] CHECK CONSTRAINT [FK_MaintenanceAircraft_Aircraft]
GO
ALTER TABLE [dbo].[maintenance_aircrafts]  WITH CHECK ADD  CONSTRAINT [FK_MaintenanceAircraft_Status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[maintenance_aircrafts] CHECK CONSTRAINT [FK_MaintenanceAircraft_Status]
GO
ALTER TABLE [dbo].[maintenance_aircrafts_hist]  WITH CHECK ADD  CONSTRAINT [FK_MaintenanceAircraftHist_maintenance_id] FOREIGN KEY([maintenance_id])
REFERENCES [dbo].[maintenance_aircrafts] ([id])
GO
ALTER TABLE [dbo].[maintenance_aircrafts_hist] CHECK CONSTRAINT [FK_MaintenanceAircraftHist_maintenance_id]
GO
ALTER TABLE [dbo].[maintenance_aircrafts_hist]  WITH CHECK ADD  CONSTRAINT [FK_MaintenanceAircraftHist_Status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[maintenance_aircrafts_hist] CHECK CONSTRAINT [FK_MaintenanceAircraftHist_Status]
GO
ALTER TABLE [dbo].[maintenance_devices]  WITH CHECK ADD  CONSTRAINT [FK_MaintenanceDevice_Device] FOREIGN KEY([device_id])
REFERENCES [dbo].[devices] ([id])
GO
ALTER TABLE [dbo].[maintenance_devices] CHECK CONSTRAINT [FK_MaintenanceDevice_Device]
GO
ALTER TABLE [dbo].[maintenance_devices]  WITH CHECK ADD  CONSTRAINT [FK_MaintenanceDevice_Status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[maintenance_devices] CHECK CONSTRAINT [FK_MaintenanceDevice_Status]
GO
ALTER TABLE [dbo].[maintenance_devices_hist]  WITH CHECK ADD  CONSTRAINT [FK_MaintenanceDeviceHist_Maintenance] FOREIGN KEY([maintenance_id])
REFERENCES [dbo].[maintenance_devices] ([id])
GO
ALTER TABLE [dbo].[maintenance_devices_hist] CHECK CONSTRAINT [FK_MaintenanceDeviceHist_Maintenance]
GO
ALTER TABLE [dbo].[maintenance_devices_hist]  WITH CHECK ADD  CONSTRAINT [FK_MaintenanceDeviceHist_Status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[maintenance_devices_hist] CHECK CONSTRAINT [FK_MaintenanceDeviceHist_Status]
GO
ALTER TABLE [dbo].[order_details]  WITH CHECK ADD FOREIGN KEY([order_id])
REFERENCES [dbo].[orders] ([id])
GO
ALTER TABLE [dbo].[order_details]  WITH CHECK ADD  CONSTRAINT [FK_order_details_products] FOREIGN KEY([product_id])
REFERENCES [dbo].[products] ([id])
GO
ALTER TABLE [dbo].[order_details] CHECK CONSTRAINT [FK_order_details_products]
GO
ALTER TABLE [dbo].[order_discount]  WITH CHECK ADD FOREIGN KEY([discount_id])
REFERENCES [dbo].[discount] ([id])
GO
ALTER TABLE [dbo].[order_discount]  WITH CHECK ADD FOREIGN KEY([order_id])
REFERENCES [dbo].[orders] ([id])
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD FOREIGN KEY([fulfillment_status_id])
REFERENCES [dbo].[fulfillment_status] ([id])
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD FOREIGN KEY([gateway_id])
REFERENCES [dbo].[gateways] ([id])
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK_Orders_BillingId] FOREIGN KEY([billing_id])
REFERENCES [dbo].[billings] ([id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK_Orders_BillingId]
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK_Orders_SaleChannelsId] FOREIGN KEY([sale_channels_id])
REFERENCES [dbo].[sale_channels] ([id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK_Orders_SaleChannelsId]
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK_Orders_TransactionId] FOREIGN KEY([transaction_id])
REFERENCES [dbo].[transactions] ([id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK_Orders_TransactionId]
GO
ALTER TABLE [dbo].[product_permission]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[products] ([id])
GO
ALTER TABLE [dbo].[product_permission]  WITH CHECK ADD FOREIGN KEY([group_role_id])
REFERENCES [dbo].[group_role] ([id])
GO
ALTER TABLE [dbo].[product_price]  WITH CHECK ADD  CONSTRAINT [FK__product_p__creat__0A9D95DB] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[product_price] CHECK CONSTRAINT [FK__product_p__creat__0A9D95DB]
GO
ALTER TABLE [dbo].[products]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[products]  WITH CHECK ADD  CONSTRAINT [FK__products__price___0F624AF8] FOREIGN KEY([price_id])
REFERENCES [dbo].[product_price] ([id])
GO
ALTER TABLE [dbo].[products] CHECK CONSTRAINT [FK__products__price___0F624AF8]
GO
ALTER TABLE [dbo].[sale_channels]  WITH CHECK ADD  CONSTRAINT [FK_payment_methods_status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[sale_channels] CHECK CONSTRAINT [FK_payment_methods_status]
GO
ALTER TABLE [dbo].[session_details]  WITH CHECK ADD  CONSTRAINT [FK__session_d__creat__245D67DE] FOREIGN KEY([session_id])
REFERENCES [dbo].[sessions] ([id])
GO
ALTER TABLE [dbo].[session_details] CHECK CONSTRAINT [FK__session_d__creat__245D67DE]
GO
ALTER TABLE [dbo].[session_details]  WITH CHECK ADD FOREIGN KEY([session_catalog_id])
REFERENCES [dbo].[session_catalog] ([id])
GO
ALTER TABLE [dbo].[sessions]  WITH CHECK ADD  CONSTRAINT [FK__sessions__create__1BC821DD] FOREIGN KEY([flight_id])
REFERENCES [dbo].[flights] ([id])
GO
ALTER TABLE [dbo].[sessions] CHECK CONSTRAINT [FK__sessions__create__1BC821DD]
GO
ALTER TABLE [dbo].[sessions]  WITH CHECK ADD  CONSTRAINT [FK__sessions__produc__1DB06A4F] FOREIGN KEY([product_id])
REFERENCES [dbo].[products] ([id])
GO
ALTER TABLE [dbo].[sessions] CHECK CONSTRAINT [FK__sessions__produc__1DB06A4F]
GO
ALTER TABLE [dbo].[sessions]  WITH CHECK ADD  CONSTRAINT [FK__sessions__user_i__1CBC4616] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[sessions] CHECK CONSTRAINT [FK__sessions__user_i__1CBC4616]
GO
ALTER TABLE [dbo].[supplier]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[tax_rate]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[telecom_redeem]  WITH CHECK ADD  CONSTRAINT [FK_flight] FOREIGN KEY([flight_id])
REFERENCES [dbo].[flights] ([id])
GO
ALTER TABLE [dbo].[telecom_redeem] CHECK CONSTRAINT [FK_flight]
GO
ALTER TABLE [dbo].[telecom_redeem]  WITH CHECK ADD  CONSTRAINT [FK_status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[telecom_redeem] CHECK CONSTRAINT [FK_status]
GO
ALTER TABLE [dbo].[telecom_redeem]  WITH CHECK ADD  CONSTRAINT [FK_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[telecom_redeem] CHECK CONSTRAINT [FK_user]
GO
ALTER TABLE [dbo].[ticket_vna]  WITH CHECK ADD  CONSTRAINT [FK_ticket_vna_flights] FOREIGN KEY([flight_id])
REFERENCES [dbo].[flights] ([id])
GO
ALTER TABLE [dbo].[ticket_vna] CHECK CONSTRAINT [FK_ticket_vna_flights]
GO
ALTER TABLE [dbo].[ticket_vna]  WITH CHECK ADD  CONSTRAINT [FK_ticket_vna_status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[ticket_vna] CHECK CONSTRAINT [FK_ticket_vna_status]
GO
ALTER TABLE [dbo].[ticket_vna]  WITH CHECK ADD  CONSTRAINT [FK_ticket_vna_users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[ticket_vna] CHECK CONSTRAINT [FK_ticket_vna_users]
GO
ALTER TABLE [dbo].[transaction_activities]  WITH CHECK ADD FOREIGN KEY([transaction_id])
REFERENCES [dbo].[transactions] ([id])
GO
ALTER TABLE [dbo].[transaction_activities]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[transactions]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[user_activities]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[user_activities]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[user_group]  WITH CHECK ADD FOREIGN KEY([group_id])
REFERENCES [dbo].[group_role] ([id])
GO
ALTER TABLE [dbo].[user_group]  WITH CHECK ADD  CONSTRAINT [FK_user_group_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[user_group] CHECK CONSTRAINT [FK_user_group_user]
GO
ALTER TABLE [dbo].[user_group_lv2]  WITH CHECK ADD  CONSTRAINT [FK_UserGroupLv2_groupIdLv1] FOREIGN KEY([group_id_lv1])
REFERENCES [dbo].[group_role] ([id])
GO
ALTER TABLE [dbo].[user_group_lv2] CHECK CONSTRAINT [FK_UserGroupLv2_groupIdLv1]
GO
ALTER TABLE [dbo].[user_group_lv2]  WITH CHECK ADD  CONSTRAINT [FK_UserGroupLv2_groupIdLv2] FOREIGN KEY([group_id_lv2])
REFERENCES [dbo].[group_role] ([id])
GO
ALTER TABLE [dbo].[user_group_lv2] CHECK CONSTRAINT [FK_UserGroupLv2_groupIdLv2]
GO
ALTER TABLE [dbo].[user_group_lv2]  WITH CHECK ADD  CONSTRAINT [FK_UserGroupLv2_userId] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[user_group_lv2] CHECK CONSTRAINT [FK_UserGroupLv2_userId]
GO
ALTER TABLE [dbo].[user_group_lv3]  WITH CHECK ADD  CONSTRAINT [FK_UserGroupLv3_groupIdLv1] FOREIGN KEY([group_id_lv1])
REFERENCES [dbo].[group_role] ([id])
GO
ALTER TABLE [dbo].[user_group_lv3] CHECK CONSTRAINT [FK_UserGroupLv3_groupIdLv1]
GO
ALTER TABLE [dbo].[user_group_lv3]  WITH CHECK ADD  CONSTRAINT [FK_UserGroupLv3_groupIdLv2] FOREIGN KEY([group_id_lv2])
REFERENCES [dbo].[group_role] ([id])
GO
ALTER TABLE [dbo].[user_group_lv3] CHECK CONSTRAINT [FK_UserGroupLv3_groupIdLv2]
GO
ALTER TABLE [dbo].[user_group_lv3]  WITH CHECK ADD  CONSTRAINT [FK_UserGroupLv3_groupIdLv3] FOREIGN KEY([group_id_lv3])
REFERENCES [dbo].[group_role] ([id])
GO
ALTER TABLE [dbo].[user_group_lv3] CHECK CONSTRAINT [FK_UserGroupLv3_groupIdLv3]
GO
ALTER TABLE [dbo].[user_group_lv3]  WITH CHECK ADD  CONSTRAINT [FK_UserGroupLv3_userId] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[user_group_lv3] CHECK CONSTRAINT [FK_UserGroupLv3_userId]
GO
ALTER TABLE [dbo].[user_login_hist]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[user_vendor]  WITH CHECK ADD  CONSTRAINT [FK_StatusId_Status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[user_vendor] CHECK CONSTRAINT [FK_StatusId_Status]
GO
ALTER TABLE [dbo].[user_vendor]  WITH CHECK ADD  CONSTRAINT [FK_UserId_UserVendor] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[user_vendor] CHECK CONSTRAINT [FK_UserId_UserVendor]
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[vouchers]  WITH CHECK ADD  CONSTRAINT [FK_Vouchers_Campaign_id] FOREIGN KEY([campaign_id])
REFERENCES [dbo].[campaign] ([id])
GO
ALTER TABLE [dbo].[vouchers] CHECK CONSTRAINT [FK_Vouchers_Campaign_id]
GO
ALTER TABLE [dbo].[vouchers]  WITH CHECK ADD  CONSTRAINT [FK_Vouchers_Product_Id] FOREIGN KEY([product_id])
REFERENCES [dbo].[products] ([id])
GO
ALTER TABLE [dbo].[vouchers] CHECK CONSTRAINT [FK_Vouchers_Product_Id]
GO
ALTER TABLE [dbo].[vouchers]  WITH CHECK ADD  CONSTRAINT [FK_Vouchers_Status] FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
ALTER TABLE [dbo].[vouchers] CHECK CONSTRAINT [FK_Vouchers_Status]
GO
USE [master]
GO
ALTER DATABASE [aviation_hub] SET  READ_WRITE 
GO
