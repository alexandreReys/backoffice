-- CreateTable
CREATE TABLE "branch_users" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "branch_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "branch_users_userId_idx" ON "branch_users"("userId");

-- CreateIndex
CREATE INDEX "branch_users_branchId_idx" ON "branch_users"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "branch_users_userId_branchId_key" ON "branch_users"("userId", "branchId");

-- AddForeignKey
ALTER TABLE "branch_users" ADD CONSTRAINT "branch_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_users" ADD CONSTRAINT "branch_users_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
