import { useState, useEffect } from "react";
import { Users as UsersIcon, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { ToastContainer } from "../components/ui/Toast";
import UserModal from "../components/UserModal";
import { useToast } from "../hooks/useToast";
import { API_ENDPOINTS } from "../config/constants";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UsersResponse {
  users: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.USERS);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: UsersResponse | User[] = await response.json();
      
      // Handle both paginated and non-paginated responses
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers(data.users || []);
      }
      
      setError(null);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove user from local state
        setUsers(prev => prev.filter(user => user._id !== userId));
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user. Please try again.");
      }
    }
  };

  const handleSubmitUser = async (formData: any) => {
    try {
      setSubmitting(true);
      const url = editingUser 
        ? `${API_ENDPOINTS.USERS}/${editingUser._id}`
        : API_ENDPOINTS.USERS;
      
      const method = editingUser ? "PUT" : "POST";
      
      // Don't send empty password for updates
      const payload = { ...formData };
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (editingUser) {
        // Update existing user in local state
        setUsers(prev => prev.map(user => 
          user._id === editingUser._id ? result.user : user
        ));
      } else {
        // Add new user to local state
        setUsers(prev => [...prev, result.user]);
      }

      setModalOpen(false);
      setEditingUser(null);
      toast.success(`User ${editingUser ? "updated" : "created"} successfully`);
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error(`Failed to ${editingUser ? "update" : "create"} user: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Users Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your application users
            </p>
          </div>
          <Button onClick={handleCreateUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Content */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-blue-600" />
              <CardTitle>All Users</CardTitle>
            </div>
            <CardDescription>
              {loading ? "Loading users..." : `${users.length} users found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  Loading users...
                </span>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="text-red-600 dark:text-red-400 mb-4">
                  Failed to load users: {error}
                </div>
                <Button onClick={fetchUsers} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && users.length === 0 && (
              <div className="text-center py-8">
                <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get started by creating your first user.
                </p>
                <Button onClick={handleCreateUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </div>
            )}

            {!loading && !error && users.length > 0 && (
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                      {user.role && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          {user.role}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Info */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>API Information</CardTitle>
            <CardDescription>
              This page demonstrates API integration with your backend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span className="font-mono text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    GET
                  </span>
                  <span className="ml-3 font-mono">/api/users</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Fetch all users
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Make sure your backend server is running on port 8000 to see user data.
                You can create users using the API endpoints or a database client.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Modal */}
        <UserModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleSubmitUser}
          user={editingUser}
          loading={submitting}
        />

        {/* Toast Container */}
        <ToastContainer toasts={toast.toasts} />
      </div>
    </div>
  );
}