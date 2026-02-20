"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, SwitchCamera, Check, RotateCcw, AlertCircle } from "lucide-react";
import { useTranslation } from "@/i18n/I18nProvider";

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

type CameraError = "denied" | "not-found" | "unknown" | null;

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<CameraError>(null);
    const [isStarting, setIsStarting] = useState(true);

    // Start camera stream
    const startCamera = useCallback(async (facing: "environment" | "user") => {
        // Stop any existing stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        setIsStarting(true);
        setCameraError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facing,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setIsStarting(false);
        } catch (err) {
            console.error("Camera error:", err);
            setIsStarting(false);

            if (err instanceof DOMException) {
                if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                    setCameraError("denied");
                } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                    setCameraError("not-found");
                } else {
                    setCameraError("unknown");
                }
            } else {
                setCameraError("unknown");
            }
        }
    }, []);

    // Initialize camera on mount
    useEffect(() => {
        startCamera(facingMode);

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Switch camera
    const handleSwitchCamera = useCallback(() => {
        const newFacing = facingMode === "environment" ? "user" : "environment";
        setFacingMode(newFacing);
        startCamera(newFacing);
    }, [facingMode, startCamera]);

    // Capture photo
    const handleCapture = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setCapturedImage(dataUrl);

        // Pause the video while reviewing
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
    }, []);

    // Retake photo
    const handleRetake = useCallback(() => {
        setCapturedImage(null);
        startCamera(facingMode);
    }, [facingMode, startCamera]);

    // Confirm and use the captured photo
    const handleUsePhoto = useCallback(() => {
        if (!canvasRef.current) return;

        canvasRef.current.toBlob(
            (blob) => {
                if (blob) {
                    const file = new File([blob], `scan_${Date.now()}.jpg`, {
                        type: "image/jpeg",
                    });
                    onCapture(file);
                }
            },
            "image/jpeg",
            0.92
        );
    }, [onCapture]);

    // Close handler
    const handleClose = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
        onClose();
    }, [onClose]);

    // Error state
    if (cameraError) {
        return (
            <div className="camera-overlay">
                <div className="camera-error-container">
                    <div className="camera-error-icon">
                        <AlertCircle size={48} />
                    </div>
                    <h3 className="camera-error-title">
                        {cameraError === "denied"
                            ? t("upload.cameraPermDenied")
                            : cameraError === "not-found"
                                ? t("upload.cameraNotFound")
                                : t("upload.cameraPermDenied")}
                    </h3>
                    <button className="camera-error-close-btn" onClick={handleClose}>
                        <X size={18} />
                        {t("upload.cameraClose")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="camera-overlay">
            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Camera preview or captured image */}
            {capturedImage ? (
                <div className="camera-review">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={capturedImage}
                        alt="Captured report"
                        className="camera-preview-img"
                    />

                    {/* Review controls */}
                    <div className="camera-controls">
                        <button
                            className="camera-ctrl-btn camera-retake-btn"
                            onClick={handleRetake}
                            title={t("upload.cameraRetake")}
                        >
                            <RotateCcw size={22} />
                            <span>{t("upload.cameraRetake")}</span>
                        </button>
                        <button
                            className="camera-ctrl-btn camera-use-btn"
                            onClick={handleUsePhoto}
                            title={t("upload.cameraUsePhoto")}
                        >
                            <Check size={22} />
                            <span>{t("upload.cameraUsePhoto")}</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="camera-viewfinder">
                    {/* Loading state */}
                    {isStarting && (
                        <div className="camera-loading">
                            <Camera size={40} className="animate-pulse" />
                            <p>{t("upload.cameraCapturing")}</p>
                        </div>
                    )}

                    {/* Video preview */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-video"
                    />

                    {/* Scan guide overlay */}
                    <div className="camera-guide">
                        <div className="camera-guide-frame" />
                        <p className="camera-guide-text">{t("upload.cameraCapturing")}</p>
                    </div>

                    {/* Camera controls */}
                    <div className="camera-controls">
                        <button
                            className="camera-ctrl-btn camera-close-btn"
                            onClick={handleClose}
                            title="Close"
                        >
                            <X size={22} />
                        </button>

                        <button
                            className="camera-shutter"
                            onClick={handleCapture}
                            disabled={isStarting}
                        >
                            <div className="camera-shutter-inner" />
                        </button>

                        <button
                            className="camera-ctrl-btn camera-switch-btn"
                            onClick={handleSwitchCamera}
                            title="Switch camera"
                        >
                            <SwitchCamera size={22} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
