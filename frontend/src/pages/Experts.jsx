import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExpertCard from "@/components/experts/ExpertCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Shield,
  Loader2,
  Check,
  CalendarDays,
  Clock,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import API_BASE_URL from "@/api";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const specializations = [
  "Anxiety",
  "Depression",
  "Stress Management",
  "Relationships",
  "Self-Esteem",
  "Trauma",
  "Academic Pressure",
  "Family Issues",
  "Grief",
  "Life Transitions",
];

export default function Experts() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("all");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingComplete, setBookingComplete] = useState(false);

  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");

  const loadExperts = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("${API_BASE_URL}/experts");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load sample professionals.");
        return;
      }

      setExperts(data.experts || []);
    } catch (error) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExperts();
  }, []);

  const handleBook = (expert) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/Login");
      return;
    }

    setSelectedExpert(expert);
    setBookingStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingNotes("");
    setBookingComplete(false);
    setError("");
  };

  const handleConfirmBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/Login");
      return;
    }

    if (!selectedExpert || !selectedDate || !selectedTime) {
      setError("Please select a date and time.");
      return;
    }

    setIsBooking(true);
    setError("");

    try {
      const response = await fetch(
        "${API_BASE_URL}/experts/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            expertId: selectedExpert._id,
            date: format(selectedDate, "yyyy-MM-dd"),
            timeSlot: selectedTime,
            notes: bookingNotes,
            isAnonymous: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to confirm booking.");
        return;
      }

      setBookingComplete(true);
    } catch (error) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const filteredExperts = experts.filter((expert) => {
    const search = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !search ||
      String(expert.name || "").toLowerCase().includes(search) ||
      (expert.specializations || []).some((specialization) =>
        specialization.toLowerCase().includes(search)
      );

    const matchesFilter =
      filterSpecialization === "all" ||
      (expert.specializations || []).includes(filterSpecialization);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          to={createPageUrl("Home")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Home</span>
        </Link>

        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Sample Professionals
              </span>
            </div>

            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              Professional Support
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Explore sample mental-health professional profiles and try the
              anonymous demo booking flow.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-teal-500" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-700">
              Anonymous demo booking
            </h3>
            <p className="text-sm text-slate-500">
              This is a project demonstration. Do not share urgent or highly
              sensitive information in booking notes.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name or specialization..."
              className="pl-12 h-12 rounded-xl border-slate-200"
            />
          </div>

          <Select
            value={filterSpecialization}
            onValueChange={setFilterSpecialization}
          >
            <SelectTrigger className="w-full sm:w-56 h-12 rounded-xl">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>

              {specializations.map((specialization) => (
                <SelectItem key={specialization} value={specialization}>
                  {specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && !selectedExpert && (
          <p className="mb-6 text-center text-sm text-red-600">{error}</p>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">
              No professionals found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <ExpertCard
                key={expert._id}
                expert={{
                  ...expert,
                  id: expert._id,
                }}
                onBook={handleBook}
              />
            ))}
          </div>
        )}

        <Dialog
          open={!!selectedExpert}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedExpert(null);
              setError("");
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {bookingComplete
                  ? "Demo Booking Confirmed!"
                  : `Book with ${selectedExpert?.name}`}
              </DialogTitle>
            </DialogHeader>

            {bookingComplete ? (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  You’re all set!
                </h3>

                <p className="text-slate-600 mb-2">
                  Your demo session with {selectedExpert?.name} is booked for:
                </p>

                <p className="font-medium text-teal-600">
                  {format(selectedDate, "MMMM d, yyyy")} at {selectedTime}
                </p>

                <Button
                  onClick={() => setSelectedExpert(null)}
                  className="mt-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="py-4">
                {bookingStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarDays className="w-5 h-5 text-teal-500" />
                      <span className="font-medium text-slate-700">
                        Select a Date
                      </span>
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="booking-date"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Choose an available weekday
                      </label>

                      <input
                        id="booking-date"
                        type="date"
                        value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                        min={format(new Date(), "yyyy-MM-dd")}
                        onChange={(event) => {
                          const value = event.target.value;

                          if (!value) {
                            setSelectedDate(null);
                            return;
                          }

                          const chosenDate = new Date(`${value}T12:00:00`);

                          if (chosenDate.getDay() === 0 || chosenDate.getDay() === 6) {
                            setSelectedDate(null);
                            setError("Please choose a weekday from Monday to Friday.");
                            return;
                          }

                          setError("");
                          setSelectedDate(chosenDate);
                        }}
                        className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      />

                      {selectedDate && (
                        <p className="text-sm text-teal-700">
                          Selected: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </p>
                      )}

                      {error && (
                        <p className="text-sm text-red-600">{error}</p>
                      )}
                    </div>

                    <Button
                      onClick={() => setBookingStep(2)}
                      disabled={!selectedDate}
                      className="w-full mt-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl"
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}

                {bookingStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-teal-500" />
                      <span className="font-medium text-slate-700">
                        Select a Time
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={
                            selectedTime === slot ? "default" : "outline"
                          }
                          onClick={() => setSelectedTime(slot)}
                          className={`rounded-xl ${selectedTime === slot ? "bg-teal-500" : ""
                            }`}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setBookingStep(1)}
                        className="flex-1 rounded-xl"
                      >
                        Back
                      </Button>

                      <Button
                        onClick={() => setBookingStep(3)}
                        disabled={!selectedTime}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl"
                      >
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}

                {bookingStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="mb-4 bg-slate-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-500">Date</span>
                          <span className="font-medium text-slate-700">
                            {format(selectedDate, "MMMM d, yyyy")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">Time</span>
                          <span className="font-medium text-slate-700">
                            {selectedTime}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="mb-4">
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Anything you’d like to share beforehand? (Optional)
                      </label>

                      <Textarea
                        value={bookingNotes}
                        onChange={(event) =>
                          setBookingNotes(event.target.value)
                        }
                        maxLength={500}
                        placeholder="Optional non-sensitive note for this demo booking..."
                        className="rounded-xl resize-none"
                      />
                    </div>

                    {error && (
                      <p className="mb-3 text-center text-sm text-red-600">
                        {error}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setBookingStep(2)}
                        className="flex-1 rounded-xl"
                      >
                        Back
                      </Button>

                      <Button
                        onClick={handleConfirmBooking}
                        disabled={isBooking}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl"
                      >
                        {isBooking && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Confirm Demo Booking
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}