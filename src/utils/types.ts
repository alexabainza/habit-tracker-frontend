export interface Habit {
  habit: {
    _id: string;
    name: string;
    goal: number;
    user_id: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
  accomplished: boolean;
  streak: number;
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

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export interface StreakCardProps {
  amount: number;
  label: string;
}
