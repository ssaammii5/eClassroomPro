"use client";

import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { initialOf } from "@/lib/schemas";

const SETTINGS_TABS = [
    { id: "profile", label: "Profile Information" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number]["id"];

const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
    "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
    "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
    "Comoros", "Congo (Democratic Republic of the)", "Congo (Republic of the)", "Costa Rica",
    "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea",
    "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
    "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
    "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
    "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
    "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia",
    "Zimbabwe",
];

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB

const emptyForm = {
    firstName: "",
    lastName: "",
    mobile: "",
    city: "",
    country: "",
    street: "",
    state: "",
    zip: "",
};

export function SettingsView({ userName = "Md. Samiur Rahman" }: { userName?: string }) {
    const [tab, setTab] = useState<SettingsTab>("profile");

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-white">
            <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
                {/* Header */}
                <h1 className="text-3xl text-gray-900">Account Settings</h1>
                <p className="mt-1 text-sm text-gray-700">In this section you can see all the information</p>

                {/* Tabs */}
                <div className="mt-6 border-b border-gray-200">
                    <nav className="flex gap-8 sm:gap-12">
                        {SETTINGS_TABS.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTab(t.id)}
                                className={`relative cursor-pointer py-3.5 text-sm font-medium transition-colors ${tab === t.id ? "text-[#1a73e8]" : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {t.label}
                                {tab === t.id && (
                                    <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-t-full bg-[#1a73e8]" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-8">
                    {tab === "profile" && <ProfileCard userName={userName} />}
                    {tab === "security" && <SecurityCard />}
                    {tab === "notifications" && <NotificationsCard />}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------ Profile tab ------------------------------ */
function ProfileCard({ userName }: { userName: string }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [flash, setFlash] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);

    const set = (key: keyof typeof emptyForm) => (value: string) => {
        setForm((p) => ({ ...p, [key]: value }));
        setErrors((p) => {
            if (!p[key]) return p;
            const next = { ...p };
            delete next[key];
            return next;
        });
    };

    /* ---------- avatar file checker: .jpg/.jpeg/.png only, < 2 MB ---------- */
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // allow re-selecting the same file
        if (!file) return;

        const validType = file.type === "image/jpeg" || file.type === "image/png";
        const validExt = /\.(jpe?g|png)$/i.test(file.name);
        if (!validType || !validExt) {
            setAvatarError("Only .jpg, .jpeg or .png files are allowed.");
            return;
        }
        if (file.size >= MAX_AVATAR_SIZE) {
            setAvatarError("Image must be smaller than 2 MB.");
            return;
        }
        setAvatarError(null);
        setAvatarUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
    };

    /* ---------- mandatory fields: first name, last name, country ---------- */
    const validate = () => {
        const next: Record<string, string> = {};
        if (!form.firstName.trim()) next.firstName = "First name is required.";
        if (!form.lastName.trim()) next.lastName = "Last name is required.";
        if (!form.country) next.country = "Country is required.";
        return next;
    };

    const save = () => {
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length > 0) return;
        setFlash(true);
        window.setTimeout(() => setFlash(false), 2000);
    };

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
                {/* Left intro */}
                <div>
                    <h2 className="text-2xl text-gray-900">Profile</h2>
                    <p className="mt-3 text-sm font-semibold text-gray-900">Personal Information</p>
                    <p className="mt-1 text-sm text-gray-700">
                        Use a permanent address where you can receive mail.
                    </p>
                </div>

                {/* Right content */}
                <div>
                    {/* Avatar row */}
                    <div className="flex flex-wrap items-center gap-5">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Profile avatar"
                                className="h-20 w-20 rounded-lg object-cover"
                            />
                        ) : (
                            <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-purple-800 text-3xl text-white">
                                {initialOf(userName)}
                            </span>
                        )}
                        <div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer rounded-md bg-[#cdd7ea] px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-[#bcc9e2]"
                            >
                                Change avatar
                            </button>
                            <p className="mt-2 text-sm text-gray-700">JPG, JPEG or PNG. Less than 2 MB.</p>
                            {avatarError && <p className="mt-1 text-sm text-[#c5221f]">{avatarError}</p>}
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        <Field
                            label="First name"
                            placeholder="Your first name"
                            value={form.firstName}
                            onChange={set("firstName")}
                            required
                            error={errors.firstName}
                        />
                        <Field
                            label="Last name"
                            placeholder="Your last name"
                            value={form.lastName}
                            onChange={set("lastName")}
                            required
                            error={errors.lastName}
                        />
                        <Field
                            label="Mobile number"
                            type="tel"
                            placeholder="Your mobile number"
                            value={form.mobile}
                            onChange={set("mobile")}
                        />
                        <Field label="City" placeholder="Your city" value={form.city} onChange={set("city")} />
                        <SelectField
                            label="Country"
                            value={form.country}
                            onChange={set("country")}
                            options={COUNTRIES}
                            required
                            error={errors.country}
                        />
                        <Field
                            label="ZIP / Postal code"
                            placeholder="00000"
                            value={form.zip}
                            onChange={set("zip")}
                        />
                        <Field
                            label="Street address"
                            placeholder="Your first address"
                            value={form.street}
                            onChange={set("street")}
                        />
                        <Field
                            label="State/Province"
                            placeholder="Your state or province"
                            value={form.state}
                            onChange={set("state")}
                        />
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex items-center justify-end gap-3">
                        {flash && <span className="text-sm font-medium text-[#188038]">Changes saved</span>}
                        <button
                            type="button"
                            onClick={() => {
                                setForm(emptyForm);
                                setErrors({});
                            }}
                            className="cursor-pointer rounded-full bg-[#cdd7ea] px-6 py-2.5 text-sm font-medium text-gray-900 hover:bg-[#bcc9e2]"
                        >
                            Discard
                        </button>
                        <button
                            type="button"
                            onClick={save}
                            className="cursor-pointer rounded-full bg-[#1a63d8] px-7 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5]"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------ Security tab ------------------------------ */
function SecurityCard() {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [repeat, setRepeat] = useState("");
    const [flash, setFlash] = useState(false);

    const clear = () => {
        setCurrent("");
        setNext("");
        setRepeat("");
    };

    const save = () => {
        clear();
        setFlash(true);
        window.setTimeout(() => setFlash(false), 2000);
    };

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
                <div>
                    <h2 className="text-2xl text-gray-900">Security</h2>
                    <p className="mt-3 text-sm font-semibold text-gray-900">Change password</p>
                    <p className="mt-1 text-sm text-gray-700">Update your password associated with your account.</p>
                </div>
                <div>
                    <div className="grid gap-5 lg:grid-cols-3">
                        <PasswordField label="Current Password" value={current} onChange={setCurrent} />
                        <PasswordField label="New password" value={next} onChange={setNext} />
                        <PasswordField label="Repeat new password" value={repeat} onChange={setRepeat} />
                    </div>
                    <div className="mt-8 flex items-center justify-end gap-3">
                        {flash && <span className="text-sm font-medium text-[#188038]">Password updated</span>}
                        <button
                            type="button"
                            onClick={clear}
                            className="cursor-pointer rounded-full bg-[#cdd7ea] px-6 py-2.5 text-sm font-medium text-gray-900 hover:bg-[#bcc9e2]"
                        >
                            Discard
                        </button>
                        <button
                            type="button"
                            onClick={save}
                            className="cursor-pointer rounded-full bg-[#1a63d8] px-7 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5]"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------ Notifications tab ------------------------------ */
function NotificationsCard() {
    const [allowEmail, setAllowEmail] = useState(true);
    const [commentsOnPosts, setCommentsOnPosts] = useState(true);
    const [mentions, setMentions] = useState(true);

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl text-gray-900">Notifications</h2>

            <div className="mt-6">
                <h3 className="text-xl text-gray-900">Email</h3>
                <p className="mt-1 text-sm text-gray-700">
                    These settings apply to the notifications you get by email.{" "}
                    <a href="#" className="text-[#1a73e8] underline hover:text-[#174ea6]">Learn more</a>
                </p>
                <ToggleRow label="Allow email notifications" enabled={allowEmail} onChange={setAllowEmail} />
            </div>

            <div className="mt-8">
                <h3 className="text-xl text-gray-900">Comments</h3>
                <ToggleRow label="Comments on your posts" enabled={commentsOnPosts} onChange={setCommentsOnPosts} />
                <ToggleRow label="Comments that mention you" enabled={mentions} onChange={setMentions} />
            </div>
        </section>
    );
}

/* ------------------------------ building blocks ------------------------------ */
interface FieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    error?: string;
}

function Field({ label, value, onChange, placeholder, type = "text", required = false, error }: FieldProps) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm text-gray-800">
                {label}
                {required && <span className="ml-0.5 text-[#c5221f]">*</span>}
            </span>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-md border bg-white px-3.5 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-1 ${error
                        ? "border-[#c5221f] focus:border-[#c5221f] focus:ring-[#c5221f]"
                        : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-[#1a73e8]"
                    }`}
            />
            {error && <span className="mt-1 block text-sm text-[#c5221f]">{error}</span>}
        </label>
    );
}

function SelectField({
    label,
    value,
    onChange,
    options,
    required = false,
    error,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    required?: boolean;
    error?: string;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm text-gray-800">
                {label}
                {required && <span className="ml-0.5 text-[#c5221f]">*</span>}
            </span>
            <span className="relative block">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full appearance-none rounded-md border bg-white px-3.5 py-2.5 pr-10 text-[15px] focus:outline-none focus:ring-1 ${error
                            ? "border-[#c5221f] focus:border-[#c5221f] focus:ring-[#c5221f]"
                            : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-[#1a73e8]"
                        } ${value ? "text-gray-900" : "text-gray-600"}`}
                >
                    <option value="" disabled>
                        Select your country
                    </option>
                    {options.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </span>
            {error && <span className="mt-1 block text-sm text-[#c5221f]">{error}</span>}
        </label>
    );
}

function PasswordField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    const [show, setShow] = useState(false);
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm text-gray-800">{label}</span>
            <span className="relative block">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-md border border-gray-400/80 bg-white px-3.5 py-2.5 pr-11 text-[15px] text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                />
                <button
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1.5 text-gray-600 hover:bg-gray-900/5"
                >
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </span>
        </label>
    );
}

function ToggleRow({
    label,
    enabled,
    onChange,
}: {
    label: string;
    enabled: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between border-b border-gray-100 py-5 last:border-b-0">
            <span className="text-sm text-gray-900">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={label}
                onClick={() => onChange(!enabled)}
                className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${enabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${enabled ? "left-6" : "left-1"
                        }`}
                />
            </button>
        </div>
    );
}