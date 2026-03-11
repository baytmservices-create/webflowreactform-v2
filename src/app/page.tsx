"use client";

import { useState, useEffect, useRef } from "react";

// ---- Data ----

const USER_TYPES = ["an individual", "a business"];

const INSURANCE_TYPES = [
  "General Liability",
  "Workers' Compensation",
  "Property Insurance",
  "Commercial Auto",
];

const COVERAGE_GOALS = [
  "protect my assets",
  "stay compliant",
  "reduce risk",
  "cover my employees",
  "secure my property",
  "get peace of mind",
];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

const INDUSTRIES = [
  "Construction","Healthcare","Manufacturing","Retail","Technology",
  "Food & Beverage","Transportation","Professional Services","Education","Other",
];

const EMPLOYEE_COUNTS = ["1-5", "6-25", "26-50", "51-100", "101-500", "500+"];

const REFERRAL_SOURCES = [
  "Google search", "Social media", "A friend or colleague",
  "LinkedIn", "An ad", "Insurance broker", "Other",
];

// ---- Main Component ----

export default function GetStarted() {
  const [step, setStep] = useState(1);

  const [userType, setUserType] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [goal, setGoal] = useState("");

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [comments, setComments] = useState("");
  const [referral, setReferral] = useState("");

  const isBusiness = userType === "a business";
  const sentenceComplete = !!userType && !!insuranceType && !!goal;
  const detailsComplete =
    fullName.trim().length > 0 &&
    city.trim().length > 0 &&
    !!state &&
    phone.trim().length >= 7 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    (!isBusiness || (!!industry && !!employeeCount));

  return (
    <div className="min-h-screen bg-white flex items-start justify-center">
      <div className="w-full max-w-3xl px-8 py-16 sm:py-24">
        {step === 1 && (
          <StepOne
            userType={userType} setUserType={setUserType}
            insuranceType={insuranceType} setInsuranceType={setInsuranceType}
            goal={goal} setGoal={setGoal}
            sentenceComplete={sentenceComplete}
            onContinue={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepTwo
            isBusiness={isBusiness}
            fullName={fullName} setFullName={setFullName}
            city={city} setCity={setCity}
            state={state} setState={setState}
            industry={industry} setIndustry={setIndustry}
            employeeCount={employeeCount} setEmployeeCount={setEmployeeCount}
            phone={phone} setPhone={setPhone}
            email={email} setEmail={setEmail}
            detailsComplete={detailsComplete}
            onContinue={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <CommentsStep
            comments={comments} setComments={setComments}
            onContinue={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <StepThree
            referral={referral} setReferral={setReferral}
            onSubmit={async () => {
              try {
                await fetch("/api/submit", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email, fullName, userType, insuranceType, goal,
                    city, state, industry, employeeCount, phone, comments, referral,
                  }),
                });
              } catch (e) {
                console.error("Submit error:", e);
              }
              setStep(5);
            }}
            onBack={() => setStep(3)}
          />
        )}
        {step === 5 && <SuccessStep fullName={fullName} />}
      </div>
    </div>
  );
}

// ============================================================
// STEP 1: Sentence Builder
// ============================================================

function StepOne({
  userType, setUserType,
  insuranceType, setInsuranceType,
  goal, setGoal,
  sentenceComplete, onContinue,
}: {
  userType: string; setUserType: (v: string) => void;
  insuranceType: string; setInsuranceType: (v: string) => void;
  goal: string; setGoal: (v: string) => void;
  sentenceComplete: boolean; onContinue: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "all 0.5s ease" }}>
      <div className="mb-10">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <rect width="50" height="50" rx="12" fill="#e91e8c" />
          <path d="M15 25 L22 32 L35 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="divider-text fade-in">Let&apos;s get started</div>

      <h1 className="sentence-heading">
        I&apos;m{" "}
        <SentenceSelect
          value={userType}
          onChange={setUserType}
          options={USER_TYPES}
          placeholder="select one"
        />
        {userType && (
          <span className="fade-in">
            {" "}and I need{" "}
            <SentenceSelect
              value={insuranceType}
              onChange={setInsuranceType}
              options={INSURANCE_TYPES}
              placeholder="insurance type"
            />
          </span>
        )}
        {insuranceType && (
          <span className="fade-in">
            {" "}to{" "}
            <SentenceSelect
              value={goal}
              onChange={setGoal}
              options={COVERAGE_GOALS}
              placeholder="my goal"
            />
            .
          </span>
        )}
      </h1>

      {sentenceComplete && (
        <div className="mt-10 fade-in">
          <button className="btn-primary" onClick={onContinue}>Continue →</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STEP 2: Details
// ============================================================

function StepTwo({
  isBusiness,
  fullName, setFullName, city, setCity, state, setState,
  industry, setIndustry, employeeCount, setEmployeeCount,
  phone, setPhone, email, setEmail,
  detailsComplete, onContinue, onBack,
}: {
  isBusiness: boolean;
  fullName: string; setFullName: (v: string) => void;
  city: string; setCity: (v: string) => void;
  state: string; setState: (v: string) => void;
  industry: string; setIndustry: (v: string) => void;
  employeeCount: string; setEmployeeCount: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  detailsComplete: boolean; onContinue: () => void; onBack: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "all 0.5s ease" }}>
      <button onClick={onBack} className="back-btn">← Back</button>
      <div className="divider-text fade-in">Tell us about yourself</div>

      <h1 className="sentence-heading">
        My name is{" "}
        <InlineInput value={fullName} onChange={setFullName} placeholder="full name" />

        {fullName.trim().length > 0 && (
          <span className="fade-in">
            {" "}and I need coverage in{" "}
            <InlineInput value={city} onChange={setCity} placeholder="city" />
            ,{" "}
            <SentenceSelect value={state} onChange={setState} options={US_STATES} placeholder="state" />
          </span>
        )}

        {city.trim().length > 0 && state && isBusiness && (
          <span className="fade-in">
            . My business is in{" "}
            <SentenceSelect value={industry} onChange={setIndustry} options={INDUSTRIES} placeholder="industry" />
            {industry && (
              <span className="fade-in">
                {" "}with{" "}
                <SentenceSelect value={employeeCount} onChange={setEmployeeCount} options={EMPLOYEE_COUNTS} placeholder="count" />
                {" "}employees
              </span>
            )}
          </span>
        )}

        {((city.trim().length > 0 && state && !isBusiness) || (isBusiness && !!industry)) && (
          <span className="fade-in">
            . Reach me at{" "}
            <InlineInput value={phone} onChange={setPhone} placeholder="phone" type="tel" />
          </span>
        )}

        {phone.trim().length >= 7 && (
          <span className="fade-in">
            {" "}or{" "}
            <InlineInput value={email} onChange={setEmail} placeholder="email" type="email" />
            .
          </span>
        )}
      </h1>

      {detailsComplete && (
        <div className="mt-10 fade-in">
          <button className="btn-primary" onClick={onContinue}>Continue →</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STEP 3: Comments
// ============================================================

function CommentsStep({
  comments, setComments, onContinue, onBack,
}: {
  comments: string; setComments: (v: string) => void;
  onContinue: () => void; onBack: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "all 0.5s ease" }}>
      <button onClick={onBack} className="back-btn">← Back</button>
      <div className="divider-text fade-in">Almost done</div>
      <h1 className="sentence-heading mb-6 fade-in">
        Anything else we should know?
      </h1>
      <p className="text-lg text-[var(--text-muted)] font-light mb-8 fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        Optional — add any details or questions.
      </p>
      <div className="fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
        <textarea
          className="comments-field"
          rows={4}
          placeholder="Type your message here..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          autoFocus
        />
      </div>
      <div className="mt-8 fade-in" style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
        <button className="btn-primary" onClick={onContinue}>
          Continue →
        </button>
      </div>
    </div>
  );
}

// ============================================================
// STEP 4: Referral
// ============================================================

function StepThree({
  referral, setReferral, onSubmit, onBack,
}: {
  referral: string; setReferral: (v: string) => void;
  onSubmit: () => void; onBack: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "all 0.5s ease" }}>
      <button onClick={onBack} className="back-btn">← Back</button>
      <div className="divider-text fade-in">Almost done</div>
      <h1 className="sentence-heading mb-8 fade-in">
        Great! Where did you hear about us?
      </h1>
      <div className="mb-10 fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        {REFERRAL_SOURCES.map((source, i) => (
          <PillOption key={source} label={source} selected={referral === source} onClick={() => setReferral(source)} delay={i * 0.06} />
        ))}
      </div>
      {referral && (
        <div className="fade-in">
          <button className="btn-primary" onClick={onSubmit}>Let&apos;s go →</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STEP 4: Success
// ============================================================

function SuccessStep({ fullName }: { fullName: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div className="text-center py-20" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease" }}>
      <div className="text-6xl mb-6 fade-in">🎉</div>
      <h1 className="sentence-heading mb-4 fade-in">
        You&apos;re all set, {fullName.split(" ")[0]}!
      </h1>
      <p className="text-xl text-[var(--text-muted)] font-light fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
        We&apos;ve received your information and will be in touch soon with your insurance quote.
      </p>
    </div>
  );
}

// ============================================================
// Custom Dropdown (replaces native <select>)
// ============================================================

function SentenceSelect({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <span style={{ position: "relative", display: "inline-block", verticalAlign: "baseline" }} ref={ref}>
      <button
        type="button"
        className={`custom-select-trigger ${value ? "has-value" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {value || placeholder}
        <svg className="custom-select-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <span className="custom-select-dropdown">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`custom-select-option ${value === opt ? "active" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}

// ============================================================
// Shared Components
// ============================================================

function InlineInput({
  value, onChange, placeholder, type = "text",
}: {
  value: string; onChange: (v: string) => void;
  placeholder: string; type?: string;
}) {
  const display = value || placeholder;
  const charCount = Math.max(display.length, 4);
  return (
    <input
      type={type}
      className={`text-field ${value ? "has-value" : ""}`}
      style={{ width: `${charCount + 1}ch` }}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function PillOption({
  label, selected, onClick, delay = 0,
}: {
  label: string; selected: boolean; onClick: () => void; delay?: number;
}) {
  return (
    <button
      className={`pill-option fade-in ${selected ? "selected" : ""}`}
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
