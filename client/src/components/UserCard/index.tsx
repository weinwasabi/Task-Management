import { User } from "@/state/api";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className="app-panel flex items-center gap-3 p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-subtle font-mono text-sm font-semibold text-ink">
        {user.username.charAt(0).toUpperCase()}
      </span>
      <div>
        <h3 className="font-medium text-ink">{user.username}</h3>
      </div>
    </div>
  );
};

export default UserCard;
