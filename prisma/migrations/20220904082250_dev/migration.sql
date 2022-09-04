-- CreateTable
CREATE TABLE "Url" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(256) NOT NULL,
    "destination" TEXT NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redirect" (
    "id" SERIAL NOT NULL,
    "urlId" INTEGER NOT NULL,
    "timestamp" TEXT NOT NULL,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_slug_key" ON "Url"("slug");

-- AddForeignKey
ALTER TABLE "Redirect" ADD CONSTRAINT "Redirect_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
