import {
  SiDiscord,
  SiGithub,
  SiGmail,
  SiInstagram,
  SiSpotify,
  SiX,
} from "@icons-pack/react-simple-icons"

export const socialLinks = [
  {
    label: "GitHub",
    source: "/socials/github",
    href: "https://github.com/velolib",
    icon: SiGithub,
    color:
      "text-[#181717] dark:text-white hover:text-[#181717] dark:hover:text-white",
  },
  {
    label: "X",
    source: "/socials/x",
    href: "https://x.com/vlocitize",
    icon: SiX,
    color: "text-black dark:text-white hover:text-black dark:hover:text-white",
  },
  {
    label: "Discord",
    source: "/socials/discord",
    href: "https://discord.com/users/689289283286466573",
    icon: SiDiscord,
    color: "text-[#5865F2] hover:text-[#5865F2]/80",
  },
  {
    label: "Instagram",
    source: "/socials/instagram",
    href: "https://instagram.com/vlocitize",
    icon: SiInstagram,
    color: "text-[#FF0069] hover:text-[#FF0069]/80",
  },
  {
    label: "Email",
    source: "/socials/email",
    href: "mailto:vlocitize@gmail.com",
    icon: SiGmail,
    color: "text-[#EA4335] hover:text-[#EA4335]/80",
  },
  {
    label: "Spotify",
    source: "/socials/spotify",
    href: "https://open.spotify.com/user/le2sdqta7f8158vtb62wc1nve",
    icon: SiSpotify,
    color: "text-[#1ED760] hover:text-[#1ED760]/80",
  },
]
