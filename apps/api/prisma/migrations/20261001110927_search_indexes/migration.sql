-- Trigram matching for case-insensitive substring search (GET /properties?q=). On Azure Database for
-- PostgreSQL, pg_trgm must first be allow-listed in the server parameter azure.extensions.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateIndex
CREATE INDEX "Property_status_createdAt_idx" ON "Property"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Property_status_price_idx" ON "Property"("status", "price");

-- CreateIndex
CREATE INDEX "Property_title_trgm_idx" ON "Property" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Property_description_trgm_idx" ON "Property" USING GIN ("description" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Property_city_trgm_idx" ON "Property" USING GIN ("city" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Property_locality_trgm_idx" ON "Property" USING GIN ("locality" gin_trgm_ops);
