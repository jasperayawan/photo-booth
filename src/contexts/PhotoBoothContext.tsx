"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import type { Filter, Frame, photoCapturedDataType } from "../types/types";
import { filters, frames } from "../data/filters";
import { getFilterStyle } from "../utils/filterUtils";

const STORAGE_KEY = "photo-booth-photos";

// State interface
interface PhotoBoothState {
  // Captured photos
  capturedPhotos: photoCapturedDataType[];

  // Filter/Frame selections
  selectedFilter: Filter;
  filterIntensity: number;
  selectedFrame: Frame;

  // Camera settings
  isMirrored: boolean;

  // Capture settings
  selectedDelay: number;
  selectedPhotoCount: number;

  // Capture state
  isCountingDown: boolean;
  countdown: number;
  currentBurstCount: number;
  isCapturing: boolean;

  // Gallery state
  showGallery: boolean;
  galleryPhoto: photoCapturedDataType | null;
  galleryIndex: number;
}

// Action types
type PhotoBoothAction =
  | { type: "LOAD_PHOTOS"; payload: photoCapturedDataType[] }
  | { type: "ADD_PHOTO"; payload: photoCapturedDataType }
  | { type: "DELETE_PHOTO"; payload: string }
  | { type: "CLEAR_PHOTOS" }
  | { type: "SET_FILTER"; payload: Filter }
  | { type: "SET_FILTER_INTENSITY"; payload: number }
  | { type: "SET_FRAME"; payload: Frame }
  | { type: "SET_MIRRORED"; payload: boolean }
  | { type: "SET_DELAY"; payload: number }
  | { type: "SET_PHOTO_COUNT"; payload: number }
  | { type: "SET_COUNTDOWN_STATE"; payload: { isCountingDown: boolean; countdown: number } }
  | { type: "SET_BURST_PROGRESS"; payload: number }
  | { type: "SET_CAPTURING"; payload: boolean }
  | { type: "OPEN_GALLERY"; payload: { photo: photoCapturedDataType; index: number } }
  | { type: "CLOSE_GALLERY" }
  | { type: "NAVIGATE_GALLERY"; payload: "prev" | "next" };

// Initial state
const initialState: PhotoBoothState = {
  capturedPhotos: [],
  selectedFilter: filters[0],
  filterIntensity: 1,
  selectedFrame: frames[0],
  isMirrored: true,
  selectedDelay: 3,
  selectedPhotoCount: 1,
  isCountingDown: false,
  countdown: 0,
  currentBurstCount: 0,
  isCapturing: false,
  showGallery: false,
  galleryPhoto: null,
  galleryIndex: -1,
};

// Reducer
function photoBoothReducer(
  state: PhotoBoothState,
  action: PhotoBoothAction
): PhotoBoothState {
  switch (action.type) {
    case "LOAD_PHOTOS":
      return {
        ...state,
        capturedPhotos: action.payload,
      };
    case "ADD_PHOTO":
      return {
        ...state,
        capturedPhotos: [...state.capturedPhotos, action.payload],
      };
    case "DELETE_PHOTO":
      const newPhotos = state.capturedPhotos.filter((p) => p.id !== action.payload);
      const wasViewingDeleted = state.galleryPhoto?.id === action.payload;
      return {
        ...state,
        capturedPhotos: newPhotos,
        showGallery: wasViewingDeleted ? false : state.showGallery,
        galleryPhoto: wasViewingDeleted ? null : state.galleryPhoto,
        galleryIndex: wasViewingDeleted ? -1 : state.galleryIndex,
      };
    case "CLEAR_PHOTOS":
      return {
        ...state,
        capturedPhotos: [],
        showGallery: false,
        galleryPhoto: null,
        galleryIndex: -1,
      };
    case "SET_FILTER":
      return {
        ...state,
        selectedFilter: action.payload,
        filterIntensity: 1, // Reset intensity when changing filter
      };
    case "SET_FILTER_INTENSITY":
      return { ...state, filterIntensity: action.payload };
    case "SET_FRAME":
      return { ...state, selectedFrame: action.payload };
    case "SET_MIRRORED":
      return { ...state, isMirrored: action.payload };
    case "SET_DELAY":
      return { ...state, selectedDelay: action.payload };
    case "SET_PHOTO_COUNT":
      return { ...state, selectedPhotoCount: action.payload };
    case "SET_COUNTDOWN_STATE":
      return {
        ...state,
        isCountingDown: action.payload.isCountingDown,
        countdown: action.payload.countdown,
      };
    case "SET_BURST_PROGRESS":
      return { ...state, currentBurstCount: action.payload };
    case "SET_CAPTURING":
      return { ...state, isCapturing: action.payload };
    case "OPEN_GALLERY":
      return {
        ...state,
        showGallery: true,
        galleryPhoto: action.payload.photo,
        galleryIndex: action.payload.index,
      };
    case "CLOSE_GALLERY":
      return {
        ...state,
        showGallery: false,
        galleryPhoto: null,
        galleryIndex: -1,
      };
    case "NAVIGATE_GALLERY": {
      const { capturedPhotos, galleryIndex } = state;
      if (capturedPhotos.length === 0) return state;

      let newIndex: number;
      if (action.payload === "prev") {
        newIndex = galleryIndex <= 0 ? capturedPhotos.length - 1 : galleryIndex - 1;
      } else {
        newIndex = galleryIndex >= capturedPhotos.length - 1 ? 0 : galleryIndex + 1;
      }

      return {
        ...state,
        galleryIndex: newIndex,
        galleryPhoto: capturedPhotos[newIndex],
      };
    }
    default:
      return state;
  }
}

// Context interface
interface PhotoBoothContextType {
  state: PhotoBoothState;
  // Photo actions
  addPhoto: (photo: photoCapturedDataType) => void;
  deletePhoto: (id: string) => void;
  clearPhotos: () => void;
  // Filter/Frame actions
  setSelectedFilter: (filter: Filter) => void;
  setFilterIntensity: (intensity: number) => void;
  setSelectedFrame: (frame: Frame) => void;
  // Camera actions
  setIsMirrored: (mirrored: boolean) => void;
  toggleMirror: () => void;
  // Capture settings
  setSelectedDelay: (delay: number) => void;
  setSelectedPhotoCount: (count: number) => void;
  // Capture state actions
  setCountdownState: (isCountingDown: boolean, countdown: number) => void;
  setBurstProgress: (current: number) => void;
  setCapturing: (capturing: boolean) => void;
  // Gallery actions
  openGallery: (photo: photoCapturedDataType, index: number) => void;
  closeGallery: () => void;
  navigateGallery: (direction: "prev" | "next") => void;
  // Computed values
  currentFilterStyle: string;
}

// Create context
const PhotoBoothContext = createContext<PhotoBoothContextType | null>(null);

// Provider component
export function PhotoBoothProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(photoBoothReducer, initialState);

  // Load photos from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const photos = JSON.parse(stored) as photoCapturedDataType[];
        if (Array.isArray(photos) && photos.length > 0) {
          dispatch({ type: "LOAD_PHOTOS", payload: photos });
        }
      }
    } catch (error) {
      console.warn("Failed to load photos from localStorage:", error);
    }
  }, []);

  // Save photos to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.capturedPhotos));
    } catch (error) {
      console.warn("Failed to save photos to localStorage:", error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        console.warn("localStorage quota exceeded. Consider clearing old photos.");
      }
    }
  }, [state.capturedPhotos]);

  // Photo actions
  const addPhoto = useCallback((photo: photoCapturedDataType) => {
    dispatch({ type: "ADD_PHOTO", payload: photo });
  }, []);

  const deletePhoto = useCallback((id: string) => {
    dispatch({ type: "DELETE_PHOTO", payload: id });
  }, []);

  const clearPhotos = useCallback(() => {
    dispatch({ type: "CLEAR_PHOTOS" });
  }, []);

  // Filter/Frame actions
  const setSelectedFilter = useCallback((filter: Filter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  }, []);

  const setFilterIntensity = useCallback((intensity: number) => {
    dispatch({ type: "SET_FILTER_INTENSITY", payload: intensity });
  }, []);

  const setSelectedFrame = useCallback((frame: Frame) => {
    dispatch({ type: "SET_FRAME", payload: frame });
  }, []);

  // Camera actions
  const setIsMirrored = useCallback((mirrored: boolean) => {
    dispatch({ type: "SET_MIRRORED", payload: mirrored });
  }, []);

  const toggleMirror = useCallback(() => {
    dispatch({ type: "SET_MIRRORED", payload: !state.isMirrored });
  }, [state.isMirrored]);

  // Capture settings
  const setSelectedDelay = useCallback((delay: number) => {
    dispatch({ type: "SET_DELAY", payload: delay });
  }, []);

  const setSelectedPhotoCount = useCallback((count: number) => {
    dispatch({ type: "SET_PHOTO_COUNT", payload: count });
  }, []);

  // Capture state actions
  const setCountdownState = useCallback(
    (isCountingDown: boolean, countdown: number) => {
      dispatch({ type: "SET_COUNTDOWN_STATE", payload: { isCountingDown, countdown } });
    },
    []
  );

  const setBurstProgress = useCallback((current: number) => {
    dispatch({ type: "SET_BURST_PROGRESS", payload: current });
  }, []);

  const setCapturing = useCallback((capturing: boolean) => {
    dispatch({ type: "SET_CAPTURING", payload: capturing });
  }, []);

  // Gallery actions
  const openGallery = useCallback(
    (photo: photoCapturedDataType, index: number) => {
      dispatch({ type: "OPEN_GALLERY", payload: { photo, index } });
    },
    []
  );

  const closeGallery = useCallback(() => {
    dispatch({ type: "CLOSE_GALLERY" });
  }, []);

  const navigateGallery = useCallback((direction: "prev" | "next") => {
    dispatch({ type: "NAVIGATE_GALLERY", payload: direction });
  }, []);

  // Computed values
  const currentFilterStyle = useMemo(
    () => getFilterStyle(state.selectedFilter.name, state.filterIntensity),
    [state.selectedFilter.name, state.filterIntensity]
  );

  const contextValue: PhotoBoothContextType = {
    state,
    addPhoto,
    deletePhoto,
    clearPhotos,
    setSelectedFilter,
    setFilterIntensity,
    setSelectedFrame,
    setIsMirrored,
    toggleMirror,
    setSelectedDelay,
    setSelectedPhotoCount,
    setCountdownState,
    setBurstProgress,
    setCapturing,
    openGallery,
    closeGallery,
    navigateGallery,
    currentFilterStyle,
  };

  return (
    <PhotoBoothContext.Provider value={contextValue}>
      {children}
    </PhotoBoothContext.Provider>
  );
}

// Custom hook for consuming context
export function usePhotoBooth() {
  const context = useContext(PhotoBoothContext);
  if (!context) {
    throw new Error("usePhotoBooth must be used within a PhotoBoothProvider");
  }
  return context;
}
