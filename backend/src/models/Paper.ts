// models/Paper.ts
interface Paper {
  id: string;
  title: string;
  abstract: string;
  content_hash: string;
  ipfs_cid: string;
  s3_key: string;
  author_id: string;
  journal_id?: string;
  nft_token_id?: string;
  status: PaperStatus;
  publication_date?: Date;
  created_at: Date;
}

enum PaperStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  REVISION_REQUESTED = 'revision_requested',
  PUBLISHED = 'published',
  REJECTED = 'rejected'
}