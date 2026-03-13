import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function OAuthRedirect() {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            // Token se user info fetch karo
            api.get("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    login(res.data, token);
                    navigate("/");
                })
                .catch(() => {
                    navigate("/login");
                });
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-xl text-gray-500">
                Google se login ho raha hai...
            </div>
        </div>
    );
}