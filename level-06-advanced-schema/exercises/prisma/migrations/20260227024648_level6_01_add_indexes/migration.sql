-- CreateIndex
CREATE INDEX "posts_published_createdAt_idx" ON "posts"("published", "createdAt");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");
