-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startPoint" TEXT NOT NULL,
    "endPoint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stoppage" (
    "id" SERIAL NOT NULL,
    "nameBn" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,

    CONSTRAINT "Stoppage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStoppage" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "stoppageId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "fare" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RouteStoppage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bus" (
    "id" SERIAL NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "imgUrl" TEXT,
    "routeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stoppage_nameEn_key" ON "Stoppage"("nameEn");

-- CreateIndex
CREATE INDEX "RouteStoppage_routeId_position_idx" ON "RouteStoppage"("routeId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStoppage_routeId_stoppageId_key" ON "RouteStoppage"("routeId", "stoppageId");

-- AddForeignKey
ALTER TABLE "RouteStoppage" ADD CONSTRAINT "RouteStoppage_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStoppage" ADD CONSTRAINT "RouteStoppage_stoppageId_fkey" FOREIGN KEY ("stoppageId") REFERENCES "Stoppage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
