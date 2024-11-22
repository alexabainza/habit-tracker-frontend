export interface Habit {
    _id: string;
    name: string;
    goal: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
  }
  
export interface User{
    _id: string;
    username: string;
    password: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;

}