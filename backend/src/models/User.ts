// models/User.ts
interface User {
  id: string;
  email: string;
  wallet_address?: string;
  institution_id?: string;
  role: UserRole;
  reputation_score: number;
  xrp_balance: number;
  created_at: Date;
  updated_at: Date;
}

enum UserRole {
  READER = 'reader',
  AUTHOR = 'author', 
  REVIEWER = 'reviewer',
  EDITOR = 'editor',
  INSTITUTION_ADMIN = 'institution_admin'
}