-- Drop planned scheduling / agent-learning tables (not in MVP scope)

ALTER TABLE "post_results" DROP CONSTRAINT IF EXISTS "post_results_scheduled_post_id_fkey";
ALTER TABLE "scheduled_posts" DROP CONSTRAINT IF EXISTS "scheduled_posts_document_id_fkey";
ALTER TABLE "scheduled_posts" DROP CONSTRAINT IF EXISTS "scheduled_posts_user_id_fkey";
ALTER TABLE "agent_learnings" DROP CONSTRAINT IF EXISTS "agent_learnings_user_id_fkey";

DROP TABLE IF EXISTS "post_results";
DROP TABLE IF EXISTS "scheduled_posts";
DROP TABLE IF EXISTS "agent_learnings";

DROP TYPE IF EXISTS "ScheduledPostStatus";
