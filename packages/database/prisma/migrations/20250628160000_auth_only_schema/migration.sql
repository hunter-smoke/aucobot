-- Auth-only schema: drop planned social / document tables

ALTER TABLE "social_accounts" DROP CONSTRAINT IF EXISTS "social_accounts_user_id_fkey";
ALTER TABLE "documents" DROP CONSTRAINT IF EXISTS "documents_user_id_fkey";

DROP TABLE IF EXISTS "social_accounts";
DROP TABLE IF EXISTS "documents";

DROP TYPE IF EXISTS "SocialPlatform";
DROP TYPE IF EXISTS "SocialAccountStatus";
DROP TYPE IF EXISTS "DocumentStatus";
