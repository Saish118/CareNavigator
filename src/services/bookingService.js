/**
 * Bed Reservation & Emergency Booking Mock Service
 */

const STORAGE_KEY = "carenavigator_bookings";

export const bookingService = {
  /**
   * Submit new bed reservation request
   */
  async createReservation(bookingData) {
    await new Promise((res) => setTimeout(res, 400));

    const refNumber = "CN-" + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      id: "bk_" + Date.now(),
      referenceNumber: refNumber,
      createdAt: new Date().toISOString(),
      status: "CONFIRMED", // "CONFIRMED", "ADMITTED", "COMPLETED"
      estimatedArrivalMin: bookingData.estimatedArrivalMin || 15,
      ...bookingData,
    };

    const existing = this.getLocalBookings();
    const updated = [newBooking, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return newBooking;
  },

  /**
   * Retrieve all saved bookings
   */
  getLocalBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Cancel booking
   */
  async cancelReservation(bookingId) {
    await new Promise((res) => setTimeout(res, 300));
    const existing = this.getLocalBookings();
    const updated = existing.filter((b) => b.id !== bookingId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  },
};
