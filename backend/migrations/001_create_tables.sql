-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  wallet_address VARCHAR(255),
  role VARCHAR(50) DEFAULT 'reader' CHECK (role IN ('reader', 'author', 'reviewer', 'editor', 'admin')),
  institution VARCHAR(255),
  reputation_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Papers table
CREATE TABLE IF NOT EXISTS papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  abstract TEXT,
  content_hash VARCHAR(255) NOT NULL,
  ipfs_cid VARCHAR(255),
  file_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'revision_requested', 'accepted', 'published', 'rejected')),
  nft_token_id VARCHAR(255),
  publication_date TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID REFERENCES papers(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'submitted')),
  recommendation VARCHAR(50) CHECK (recommendation IN ('accept', 'minor_revisions', 'major_revisions', 'reject')),
  scores JSONB,
  comments TEXT,
  confidential_comments TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID REFERENCES papers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_xrp DECIMAL(12, 6) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('xrp_direct', 'stripe', 'institutional')),
  xrpl_tx_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_papers_author ON papers(author_id);
CREATE INDEX idx_papers_status ON papers(status);
CREATE INDEX idx_reviews_paper ON reviews(paper_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_transactions_paper ON transactions(paper_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
