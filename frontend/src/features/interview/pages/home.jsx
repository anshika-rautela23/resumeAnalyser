import { useState } from "react";
import { useNavigate } from "react-router";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";

const Home=()=>{
    const navigate = useNavigate()
    const { generateReport, loading, error } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resume, setResume] = useState(null)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const report = await generateReport({ jobDescription, selfDescription, resume })
        if (report?._id) {
            navigate(`/interview/${report._id}`)
        }
    }

    return (
        <main className="home">
            <div className="home-workspace">
                <header className="home-header">
                    <p className="eyebrow">AI interview studio</p>
                    <h1>Build your next interview.</h1>
                    <p className="intro">Bring the role, your experience, and your story together in one focused workspace.</p>
                </header>

                <form id="interview-form" className="interview-details" aria-label="Interview details" onSubmit={handleSubmit}>
                    <section className="panel role-panel">
                        <div className="panel-heading">
                            <span className="panel-number">01</span>
                            <div>
                                <h2>Role brief</h2>
                                <p>Tell us about the opportunity.</p>
                            </div>
                        </div>
                        <textarea name="jobDescription" id="job" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description here" required></textarea>
                    </section>

                    <section className="panel profile-panel">
                        <div className="panel-heading">
                            <span className="panel-number">02</span>
                            <div>
                                <h2>Your profile</h2>
                                <p>Give the interviewer your context.</p>
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="resume">Resume</label>
                            <input type="file" name="resume" id="resume" accept="application/pdf,.pdf" onChange={(event) => setResume(event.target.files?.[0] ?? null)} required />
                            <span className="field-hint">PDF format, up to 10 MB</span>
                        </div>
                        <div className="input-group">
                            <label htmlFor="selfDescription">About you</label>
                            <textarea name="selfDescription" id="selfDescription" value={selfDescription} onChange={(event) => setSelfDescription(event.target.value)} placeholder="Share your experience, strengths, and goals" required></textarea>
                        </div>
                    </section>

                    {error && <p className="auth-error" role="alert">{error}</p>}
                    <button className="generate-button" type="submit" disabled={loading}>Generate interview <span aria-hidden="true">&rarr;</span></button>
                </form>
            </div>
        </main>
    )
}


export default Home;