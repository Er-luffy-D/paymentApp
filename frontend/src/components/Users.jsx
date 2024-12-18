import { useEffect, useState } from "react"
import { Button } from "./Button"
import axios from "axios";
import { useNavigate } from "react-router"

export const Users = () => {
    // Replace with backend call
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {

        // Added debouncing for reducing unnecessary api calls
        const timer = setTimeout(() => {
            if (search) {
                axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${search}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                    .then((response) => setUsers(response.data.user))
                    .catch((error) => console.error("Error fetching users:", error));
            } else {
                axios.get(`http://localhost:3000/api/v1/user/bulk`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                    .then((response) => setUsers(response.data.user))
                    .catch((error) => console.error("Error fetching all users:", error));
            }
        }, 500);
        return () => clearTimeout(timer);
    }
        , [search])
    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div>
            {users.map(user => <User user={user} />)}
        </div>
    </>
}

function User({ user }) {
    const navigate = useNavigate();
    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={() => {
                navigate(`/send?to=${user._id}&name=${user.firstName}`)
            }} label={"Send Money"} />
        </div>
    </div>
}