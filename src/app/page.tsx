"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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

  // Step 1: sentence builder
  const [userType, setUserType] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [goal, setGoal] = useState("");

  // Step 2: details
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Step 3: referral
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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-3xl px-8 py-16">
        {step === 1 && (
          <StepOne
            userType={userType}
            setUserType={setUserType}
            insuranceType={insuranceType}
            setInsuranceType={setInsuranceType}
            goal={goal}
            setGoal={setGoal}
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
          <StepThree
            referral={referral}
            setReferral={setReferral}
            onSubmit={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <SuccessStep fullName={fullName} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// STEP 1: Sentence Builder (StoryPrompt style)
// ============================================================

function StepOne({
  userType, setUserType,
  insuranceType, setInsuranceType,
  goal, setGoal,
  sentenceComplete,
  onContinue,
}: {
  userType: string; setUserType: (v: string) => void;
  insuranceType: string; setInsuranceType: (v: string) => void;
  goal: string; setGoal: (v: string) => void;
  sentenceComplete: boolean;
  onContinue: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div
      className="transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}
    >
      {/* Logo placeholder */}
      <div className="mb-10">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <rect width="50" height="50" rx="12" fill="#e91e8c" />
          <path d="M15 25 L22 32 L35 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="divider-text fade-in">Let&apos;s get started</div>

      {/* The sentence — this is the key StoryPrompt pattern */}
      <h1 className="text-[32px] sm:text-[42px] font-light leading-[1.6] mb-10">
        <span className="statement">
          I&apos;m{" "}
          <SentenceSelect
            value={userType}
            onChange={setUserType}
            options={USER_TYPES}
            placeholder="select one"
          />
        </span>

        {userType && (
          <span className="statement fade-in">
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
          <span className="statement fade-in">
            {" "}to{" "}
            <span className="word-highlight">
              <SentenceSelect
                value={goal}
                onChange={setGoal}
                options={COVERAGE_GOALS}
                placeholder="my goal"
              />
              <HighlightSVG />
            </span>
            .
          </span>
        )}
      </h1>

      {sentenceComplete && (
        <div className="fade-in">
          <button className="btn-primary" onClick={onContinue}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STEP 2: Details (sentence-style flowing fields)
// ============================================================

function StepTwo({
  isBusiness,
  fullName, setFullName,
  city, setCity,
  state, setState,
  industry, setIndustry,
  employeeCount, setEmployeeCount,
  phone, setPhone,
  email, setEmail,
  detailsComplete,
  onContinue,
  onBack,
}: {
  isBusiness: boolean;
  fullName: string; setFullName: (v: string) => void;
  city: string; setCity: (v: string) => void;
  state: string; setState: (v: string) => void;
  industry: string; setIndustry: (v: string) => void;
  employeeCount: string; setEmployeeCount: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  detailsComplete: boolean;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div
      className="transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}
    >
      <button onClick={onBack} className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] mb-8 cursor-pointer transition-colors">
        ← Back
      </button>

      <div className="divider-text fade-in">Tell us about yourself</div>

      <h1 className="text-[28px] sm:text-[38px] font-light leading-[1.8] mb-10">
        <span className="statement">
          My name is{" "}
          <InlineInput
            value={fullName}
            onChange={setFullName}
            placeholder="your full name"
          />
        </span>

        {fullName.trim().length > 0 && (
          <span className="statement fade-in">
            {" "}and I need coverage in{" "}
            <InlineInput
              value={city}
              onChange={setCity}
              placeholder="city"
              width="140px"
            />
            ,{" "}
            <SentenceSelect
              value={state}
              onChange={setState}
              options={US_STATES}
              placeholder="state"
            />
          </span>
        )}

        {city.trim().length > 0 && state && isBusiness && (
          <span className="statement fade-in">
            . My business is in{" "}
            <SentenceSelect
              value={industry}
              onChange={setIndustry}
              options={INDUSTRIES}
              placeholder="industry"
            />
            {industry && (
              <span className="fade-in">
                {" "}with{" "}
                <SentenceSelect
                  value={employeeCount}
                  onChange={setEmployeeCount}
                  options={EMPLOYEE_COUNTS}
                  placeholder="how many"
                />
                {" "}employees
              </span>
            )}
          </span>
        )}

        {((city.trim().length > 0 && state && !isBusiness) || (isBusiness && !!industry)) && (
          <span className="statement fade-in">
            . Reach me at{" "}
            <InlineInput
              value={phone}
              onChange={setPhone}
              placeholder="phone number"
              width="180px"
              type="tel"
            />
          </span>
        )}

        {phone.trim().length >= 7 && (
          <span className="statement fade-in">
            {" "}or{" "}
            <span className="word-highlight">
              <InlineInput
                value={email}
                onChange={setEmail}
                placeholder="email address"
                width="240px"
                type="email"
              />
              <HighlightSVG />
            </span>
            .
          </span>
        )}
      </h1>

      {detailsComplete && (
        <div className="fade-in">
          <button className="btn-primary" onClick={onContinue}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STEP 3: Referral (pill selection)
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
    <div
      className="transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}
    >
      <button onClick={onBack} className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] mb-8 cursor-pointer transition-colors">
        ← Back
      </button>

      <div className="divider-text fade-in">Almost done</div>

      <h1 className="text-[32px] sm:text-[42px] font-light leading-[1.5] mb-8 fade-in">
        Great! Where did you hear about us?
      </h1>

      <div className="mb-10 fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        {REFERRAL_SOURCES.map((source, i) => (
          <PillOption
            key={source}
            label={source}
            selected={referral === source}
            onClick={() => setReferral(source)}
            delay={i * 0.06}
          />
        ))}
      </div>

      {referral && (
        <div className="fade-in">
          <button className="btn-primary" onClick={onSubmit}>
            Let&apos;s go →
          </button>
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
  const firstName = fullName.split(" ")[0];

  return (
    <div
      className="transition-all duration-700 text-center py-20"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
    >
      <div className="text-6xl mb-6 fade-in">🎉</div>
      <h1 className="text-[36px] sm:text-[46px] font-light leading-[1.4] mb-4 fade-in">
        You&apos;re all set, <span className="word-highlight">{firstName}<HighlightSVG /></span>!
      </h1>
      <p className="text-xl text-[var(--text-muted)] font-light fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
        We&apos;ve received your information and will be in touch soon with your insurance quote.
      </p>
    </div>
  );
}

// ============================================================
// Shared Components
// ============================================================

function SentenceSelect({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string;
}) {
  return (
    <span className="select-wrapper">
      <select
        className="sentence-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </span>
  );
}

function InlineInput({
  value, onChange, placeholder, width = "200px", type = "text",
}: {
  value: string; onChange: (v: string) => void;
  placeholder: string; width?: string; type?: string;
}) {
  return (
    <input
      type={type}
      className="text-field"
      style={{ width, minWidth: "100px" }}
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

function HighlightSVG() {
  return (
    <svg viewBox="0 0 200 8" preserveAspectRatio="none" style={{ position: "absolute", bottom: "-4px", left: 0, right: 0, width: "100%", height: "6px" }}>
      <path
        d="M0 5 Q50 0 100 5 Q150 8 200 4"
        fill="none"
        stroke="#e91e8c"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
