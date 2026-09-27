'use client'
import React, { useEffect, useState } from 'react'
import { getAllUsers, updateUser } from '@/server-actions/users'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PageTitle from "@/components/ui/page-title"

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [filterEmail, setFilterEmail] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers()
      if (response.success && response.data) {
        setUsers(response.data as User[])
      }
    } catch (error) {
      console.error("Failed to fetch users", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesEmail = user.email.toLowerCase().includes(filterEmail.toLowerCase())
    const matchesRole = filterRole === 'all' ? true : user.role === filterRole
    const matchesStatus = filterStatus === 'all' 
      ? true 
      : (filterStatus === 'active' ? user.isActive : !user.isActive)
    return matchesEmail && matchesRole && matchesStatus
  })

  const handleUpdate = async (userId: string, field: 'role' | 'isActive', value: any) => {
    setSavingId(userId)
    try {
      const payload = { [field]: value }
      const response = await updateUser(userId, payload)
      if (response.success) {
        // Update local state
        setUsers(users.map(u => u.id === userId ? { ...u, [field]: value } : u))
      } else {
        alert(response.message || "Failed to update user")
      }
    } catch (error) {
      console.error("Update error", error)
      alert("An error occurred while updating user")
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return <div className="p-6">Loading users...</div>
  }

  return (
    <div className="flex flex-col gap-5 mt-5">
      <PageTitle title="Users Management" />

      <div className="flex flex-col md:flex-row gap-6 bg-white p-4 border border-primary rounded-lg shadow-sm">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-gray-600">Email Search</label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded outline-none focus:border-primary text-sm w-full"
            placeholder="Search by email..."
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Role</label>
          <div className="flex items-center gap-4 mt-1">
            <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="role" value="all" checked={filterRole === 'all'} onChange={(e) => setFilterRole(e.target.value)} className="cursor-pointer" /> All</label>
            <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="role" value="customer" checked={filterRole === 'customer'} onChange={(e) => setFilterRole(e.target.value)} className="cursor-pointer" /> Customer</label>
            <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="role" value="admin" checked={filterRole === 'admin'} onChange={(e) => setFilterRole(e.target.value)} className="cursor-pointer" /> Admin</label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Status</label>
          <div className="flex items-center gap-4 mt-1">
            <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="status" value="all" checked={filterStatus === 'all'} onChange={(e) => setFilterStatus(e.target.value)} className="cursor-pointer" /> All</label>
            <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="status" value="active" checked={filterStatus === 'active'} onChange={(e) => setFilterStatus(e.target.value)} className="cursor-pointer" /> Active</label>
            <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="status" value="inactive" checked={filterStatus === 'inactive'} onChange={(e) => setFilterStatus(e.target.value)} className="cursor-pointer" /> Inactive</label>
          </div>
        </div>

        <div className="flex items-end mb-1">
          <button
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded border border-gray-300 transition-colors"
            onClick={() => {
              setFilterEmail("");
              setFilterRole("all");
              setFilterStatus("all");
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white border border-primary rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="border-primary">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-b-gray-100">
                <TableCell className="font-medium text-xs text-gray-500">{user.id}</TableCell>
                <TableCell className="font-medium text-gray-800">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <select
                    className="p-2 border border-gray-300 rounded text-sm disabled:opacity-50 outline-none focus:border-primary"
                    value={user.role}
                    disabled={savingId === user.id}
                    onChange={(e) => handleUpdate(user.id, 'role', e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </TableCell>
                <TableCell>
                  <select
                    className="p-2 border border-gray-300 rounded text-sm disabled:opacity-50 outline-none focus:border-primary"
                    value={user.isActive ? 'active' : 'inactive'}
                    disabled={savingId === user.id}
                    onChange={(e) => handleUpdate(user.id, 'isActive', e.target.value === 'active')}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
