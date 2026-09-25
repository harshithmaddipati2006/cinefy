import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("cinefy_wishlist");
      return saved ? JSON.parse(saved) : ["m1", "m2"];
    } catch (e) {
      return ["m1", "m2"];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("cinefy_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  }, [wishlist]);

  const toggleWishlist = (movieId, movieTitle = "") => {
    setWishlist((prev) => {
      const isAlreadyAdded = prev.includes(movieId);
      let next;
      if (isAlreadyAdded) {
        next = prev.filter((id) => id !== movieId);
        showToast(movieTitle ? `Removed "${movieTitle}" from your Wishlist` : "Removed from Wishlist", "remove");
      } else {
        next = [...prev, movieId];
        showToast(movieTitle ? `Added "${movieTitle}" to your Wishlist!` : "Added to Wishlist!", "add");
      }
      return next;
    });
  };

  const addToWishlist = (movieId, movieTitle = "") => {
    setWishlist((prev) => {
      if (prev.includes(movieId)) return prev;
      showToast(movieTitle ? `Added "${movieTitle}" to your Wishlist!` : "Added to Wishlist!", "add");
      return [...prev, movieId];
    });
  };

  const removeFromWishlist = (movieId, movieTitle = "") => {
    setWishlist((prev) => {
      if (!prev.includes(movieId)) return prev;
      showToast(movieTitle ? `Removed "${movieTitle}" from your Wishlist` : "Removed from Wishlist", "remove");
      return prev.filter((id) => id !== movieId);
    });
  };

  const isWishlisted = (movieId) => {
    return wishlist.includes(movieId);
  };

  const showToast = (message, type = "add") => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        toastMessage
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-slate-900 border border-cyan-400/80 text-white px-4 py-3 rounded-2xl shadow-2xl shadow-cyan-500/30 flex items-center gap-3 backdrop-blur-md">
            <div className={`w-3 h-3 rounded-full ${toastMessage.type === "add" ? "bg-rose-500 animate-ping" : "bg-cyan-400"}`} />
            <span className="text-xs font-bold">{toastMessage.message}</span>
          </div>
        </div>
      )}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
