import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { Unlock } from "lucide-react";
import { Ban } from "lucide-react";
import { Utensils } from "lucide-react";
import { Check } from "lucide-react";
import { LogOut } from "lucide-react";
import { Clock } from "lucide-react";
import { CheckCircle } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { toast } from "sonner";
import logo from "@/Logo/logo.jpeg";
import api from "@/lib/api";

const HEADER_HEIGHT = 96;

const RestaurantAdmin = () => {
  const navigate = useNavigate();

  // Pending table state
  const [pendingPage, setPendingPage] = useState(0);
  const [pendingRowsPerPage, setPendingRowsPerPage] = useState(5);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingRefreshing, setPendingRefreshing] = useState(false);

  // Approved table state
  const [approvedPage, setApprovedPage] = useState(0);
  const [approvedRowsPerPage, setApprovedRowsPerPage] = useState(5);
  const [approvedRestaurants, setApprovedRestaurants] = useState([]);
  const [approvedLoading, setApprovedLoading] = useState(true);
  const [approvedRefreshing, setApprovedRefreshing] = useState(false);

  const [error, setError] = useState(null);

  // Reject dialog state
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Fetch pending restaurants
  const fetchPendingRestaurants = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setPendingRefreshing(true);
      } else {
        setPendingLoading(true);
      }
      setError(null);
      const response = await api.get("/api/admin/restaurants/pending");
      setPendingRestaurants(Array.isArray(response.data) ? response.data : []);
      if (isRefresh) {
        toast.success("Pending restaurants refreshed");
      }
    } catch (err) {
      setError("Failed to fetch pending restaurants");
      toast.error("Failed to refresh pending restaurants");
    } finally {
      setPendingLoading(false);
      setPendingRefreshing(false);
    }
  };

  // Fetch approved restaurants
  const fetchApprovedRestaurants = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setApprovedRefreshing(true);
      } else {
        setApprovedLoading(true);
      }
      setError(null);
      const response = await api.get("/api/admin/restaurants/getAll");
      setApprovedRestaurants(Array.isArray(response.data) ? response.data : []);
      if (isRefresh) {
        toast.success("Approved restaurants refreshed");
      }
    } catch (err) {
      setError("Failed to fetch approved restaurants");
      toast.error("Failed to refresh approved restaurants");
    } finally {
      setApprovedLoading(false);
      setApprovedRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendingRestaurants();
    fetchApprovedRestaurants();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    navigate("/login", { replace: true });
  };

  // Approve - moves from pending to approved
  const handleApprove = async (id) => {
    try {
      await api.post(`/api/admin/restaurants/${id}/approve`);
      setPendingRestaurants((prev) => prev.filter((r) => r.id !== id));
      fetchApprovedRestaurants(true); // Refresh approved list
      toast.success("Restaurant approved!");
    } catch {
      toast.error("Failed to approve restaurant");
    }
  };

  // Block - only in approved table
  const handleBlock = async (id) => {
    try {
      await api.post(`/api/admin/restaurants/${id}/block`);
      setApprovedRestaurants((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "BLOCKED" } : r))
      );
      toast.success("Restaurant blocked");
    } catch {
      toast.error("Failed to block restaurant");
    }
  };

  // Unblock - only in approved table
  const handleUnblock = async (id) => {
    try {
      await api.post(`/api/admin/restaurants/${id}/unblock`);
      setApprovedRestaurants((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
      );
      toast.success("Restaurant unblocked");
    } catch {
      toast.error("Failed to unblock restaurant");
    }
  };

  // Reject - only in approved table
  const openRejectDialog = (id) => {
    setSelectedRestaurantId(id);
    setRejectReason("");
    setRejectOpen(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Reject reason is required");
      return;
    }

    try {
      await api.post(
        `/api/admin/restaurants/${selectedRestaurantId}/reject`,
        null,
        { params: { reason: rejectReason } }
      );

      setApprovedRestaurants((prev) =>
        prev.filter((r) => r.id !== selectedRestaurantId)
      );

      toast.success("Restaurant rejected");
      setRejectOpen(false);
    } catch {
      toast.error("Failed to reject restaurant");
    }
  };

  // Stats
  const totalRestaurants =
    pendingRestaurants.length + approvedRestaurants.length;
  const approvedCount = approvedRestaurants.filter(
    (r) => r.status === "APPROVED"
  ).length;
  const pendingCount = pendingRestaurants.length;

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US");

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* HEADER */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-8"
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="h-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logo} className="h-16 mix-blend-multiply" alt="Logo" />
            <div>
              <h1 className="text-2xl font-black">Admin Console</h1>
              <p className="text-sm text-slate-400">
                Manage all registered partners
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex gap-2 items-center hover:text-slate-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-8" style={{ marginTop: HEADER_HEIGHT + 24 }}>
        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            label="Total Restaurants"
            value={totalRestaurants}
            icon={<Utensils />}
            color="bg-orange-500"
          />
          <StatCard
            label="Approved"
            value={approvedCount}
            icon={<CheckCircle />}
            color="bg-emerald-500"
          />
          <StatCard
            label="Reviewing"
            value={pendingCount}
            icon={<Clock />}
            color="bg-amber-500"
          />
        </div>

        {/* PENDING RESTAURANTS TABLE */}
        <div className="bg-white rounded-3xl shadow border overflow-hidden mb-8">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Pending Approvals</h2>
              <p className="text-sm text-slate-500">
                Restaurants waiting for approval
              </p>
            </div>
            <button
              onClick={() => fetchPendingRestaurants(true)}
              disabled={pendingRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                size={16}
                className={pendingRefreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {pendingLoading ? (
            <div className="py-20 text-center">
              <CircularProgress />
            </div>
          ) : pendingRestaurants.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <Clock size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">
                No restaurants pending approval
              </p>
              <p className="text-sm">All caught up!</p>
            </div>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Restaurant</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {pendingRestaurants
                      .slice(
                        pendingPage * pendingRowsPerPage,
                        pendingPage * pendingRowsPerPage + pendingRowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.phone || "N/A"}</TableCell>
                          <TableCell>{row.address?.city || "N/A"}</TableCell>
                          <TableCell>{formatDate(row.createdAt)}</TableCell>
                          <TableCell>
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                              {row.status}
                            </span>
                          </TableCell>

                          <TableCell align="right">
                            <Tooltip title="Approve">
                              <IconButton
                                onClick={() => handleApprove(row.id)}
                                color="success"
                              >
                                <Check />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={pendingRestaurants.length}
                page={pendingPage}
                rowsPerPage={pendingRowsPerPage}
                onPageChange={(_, p) => setPendingPage(p)}
                onRowsPerPageChange={(e) => {
                  setPendingRowsPerPage(+e.target.value);
                  setPendingPage(0);
                }}
              />
            </>
          )}
        </div>

        {/* APPROVED RESTAURANTS TABLE */}
        <div className="bg-white rounded-3xl shadow border overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Approved Restaurants</h2>
              <p className="text-sm text-slate-500">
                Manage approved restaurant partners
              </p>
            </div>
            <button
              onClick={() => fetchApprovedRestaurants(true)}
              disabled={approvedRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                size={16}
                className={approvedRefreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {approvedLoading ? (
            <div className="py-20 text-center">
              <CircularProgress />
            </div>
          ) : approvedRestaurants.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <Utensils size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">
                No approved restaurants yet
              </p>
              <p className="text-sm">
                Approve pending restaurants to see them here
              </p>
            </div>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Restaurant</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {approvedRestaurants
                      .slice(
                        approvedPage * approvedRowsPerPage,
                        approvedPage * approvedRowsPerPage + approvedRowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.phone || "N/A"}</TableCell>
                          <TableCell>{row.address?.city || "N/A"}</TableCell>
                          <TableCell>{formatDate(row.createdAt)}</TableCell>
                          <TableCell>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                row.status === "APPROVED"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {row.status}
                            </span>
                          </TableCell>

                          <TableCell align="right">
                            {row.status === "APPROVED" && (
                              <Tooltip title="Block">
                                <IconButton
                                  onClick={() => handleBlock(row.id)}
                                  color="error"
                                >
                                  <Ban />
                                </IconButton>
                              </Tooltip>
                            )}

                            {row.status === "BLOCKED" && (
                              <Tooltip title="Unblock">
                                <IconButton
                                  onClick={() => handleUnblock(row.id)}
                                  color="success"
                                >
                                  <Unlock />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip title="Reject">
                              <IconButton
                                onClick={() => openRejectDialog(row.id)}
                                color="error"
                              >
                                <X />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={approvedRestaurants.length}
                page={approvedPage}
                rowsPerPage={approvedRowsPerPage}
                onPageChange={(_, p) => setApprovedPage(p)}
                onRowsPerPageChange={(e) => {
                  setApprovedRowsPerPage(+e.target.value);
                  setApprovedPage(0);
                }}
              />
            </>
          )}
        </div>
      </main>

      {/* REJECT DIALOG */}
      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} fullWidth>
        <DialogTitle>Reject Restaurant</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            placeholder="Enter reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRejectOpen(false)}
            style={{ background: "gray", color: "white" }}
          >
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleReject}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border flex justify-between items-center">
    <div>
      <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
      <p className="text-4xl font-black">{value}</p>
    </div>
    <div
      className={`w-14 h-14 rounded-xl ${color} text-white flex items-center justify-center`}
    >
      {icon}
    </div>
  </div>
);

export default RestaurantAdmin;
