-- CreateTable
CREATE TABLE "PelayananRumahSakit" (
    "id_pelayananRS" SERIAL NOT NULL,
    "Persyaratan" TEXT NOT NULL,
    "Prosedur" TEXT NOT NULL,
    "JangkaWaktu" TEXT NOT NULL,
    "Biaya" DOUBLE PRECISION NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "PelayananRumahSakit_pkey" PRIMARY KEY ("id_pelayananRS")
);

-- AddForeignKey
ALTER TABLE "PelayananRumahSakit" ADD CONSTRAINT "PelayananRumahSakit_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
