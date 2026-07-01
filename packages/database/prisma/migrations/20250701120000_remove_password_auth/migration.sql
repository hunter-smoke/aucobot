-- DropTable
DROP TABLE "email_verification_tokens";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password_hash";
