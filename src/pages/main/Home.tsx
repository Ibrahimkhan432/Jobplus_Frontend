import "../../index.css"
import Footer from "../../components/Footer"
import Navbar from "../../components/global/Navbar"
import LatestJobs from "@/components/LatestJobs"
import Hero from "@/components/Hero"
import useGetAllJobs from "@/hooks/useGetAllJobs"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((store: any) => store.auth);

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/recruiter/dashboard")
    }
  }, [])

  useGetAllJobs();
  return (
    <div className="bg-landing min-h-screen">
      <Navbar variant="landing" />
      <Hero />
      <LatestJobs />
      <Footer />
    </div>
  )
}