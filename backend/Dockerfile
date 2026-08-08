FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["src/API/eClassroomPro.API.csproj", "src/API/"]
COPY ["src/Application/eClassroomPro.Application.csproj", "src/Application/"]
COPY ["src/Domain/eClassroomPro.Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/eClassroomPro.Infrastructure.csproj", "src/Infrastructure/"]

RUN dotnet restore src/API/eClassroomPro.API.csproj

COPY . .

RUN dotnet publish src/API/eClassroomPro.API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080

ENTRYPOINT ["dotnet", "eClassroomPro.API.dll"]