import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api";

function AvatarMenu() {
	const { user, setUser, loading } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await api.post("/users/logout/", null, { withCredentials: true }); // clear cookie
			setUser(null);
			navigate("/", { replace: true });
			window.location.reload();
		} catch (err) {
			console.error("Logout failed", err);
		}
	};

	// If user info is still loading, show fallback
	if (loading) {
		return (
			<Button size="icon-lg" variant="ghost" disabled>
				<Avatar>
					<AvatarFallback>...</AvatarFallback>
				</Avatar>
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon-lg" variant="ghost" className="cursor-pointer">
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuLabel>
					<div className="inline-flex">
						<Avatar>
							<AvatarImage src="https://github.com/shadcn.png" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div className="flex flex-col items-start justify-start text-start">
							<DropdownMenuLabel className="font-bold">{user ? `${user.first_name} ${user.last_name}` : "Guest"}</DropdownMenuLabel>
							<p className="px-2">{user ? `${user.email}` : ``}</p>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="cursor-pointer" disabled>
						Settings
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuGroup>
					<Link to="/orders">
						<DropdownMenuItem className="cursor-pointer">Order History</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				{/* <DropdownMenuSeparator />
				<DropdownMenuItem disabled>API</DropdownMenuItem> */}
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default AvatarMenu;
