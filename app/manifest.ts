import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mindbase Company Chat",
    short_name: "Mindbase",
    description: "Company Chat Application",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone", // Changed from fullscreen for better iOS stability
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/logo.png", // Ensure you have a PNG version
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
