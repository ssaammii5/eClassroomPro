"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AcademicFormModalProps {
    open: boolean;
    type: "program" | "semester" | "department";
    item: { id: number; name: string; description?: string; code?: string } | null;
    onSave: (data: { name: string; description?: string; code?: string }) => void;
    onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
    program: "Program",
    semester: "Semester",
    department: "Department",
};

export function AcademicFormModal({ open, type, item, onSave, onClose }: AcademicFormModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open) {
            setName(item?.name ?? "");
            setDescription((item as any)?.description ?? "");
            setCode((item as any)?.code ?? "");
            setErrors({});
        }
    }, [open, item]);

    const validate = () => {
        const next: Record<string, string> = {};
        if (!name.trim()) next.name = `${TYPE_LABELS[type]} name is required.`;
        if (type === "department" && !code.trim()) next.code = "Department code is required.";
        return next;
    };

    const handleSubmit = () => {
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        onSave({
            name: name.trim(),
            description: description.trim(),
            code: code.trim(),
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {item ? `Edit ${TYPE_LABELS[type]}` : `Add New ${TYPE_LABELS[type]}`}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="mt-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">
                            {TYPE_LABELS[type]} Name <span className="text-[#c5221f]">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                            placeholder={
                                type === "program"
                                    ? "e.g., Undergraduate, Postgraduate, PhD"
                                    : type === "semester"
                                        ? "e.g., January-June/2025, July-December/2025"
                                        : "e.g., Computer Science and Engineering"
                            }
                            className={`w-full rounded-md border px-3.5 py-2.5 text-[15px] focus:outline-none ${errors.name
                                    ? "border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                    : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                }`}
                        />
                        {errors.name && <span className="mt-1 block text-sm text-[#c5221f]">{errors.name}</span>}
                    </div>

                    {/* Code (Department only) */}
                    {type === "department" && (
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-800">
                                Department Code <span className="text-[#c5221f]">*</span>
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => { setCode(e.target.value); setErrors((p) => ({ ...p, code: "" })); }}
                                placeholder="e.g., CSE, BBA, EEE"
                                className={`w-full rounded-md border px-3.5 py-2.5 text-[15px] focus:outline-none ${errors.code
                                        ? "border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                        : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                    }`}
                            />
                            {errors.code && <span className="mt-1 block text-sm text-[#c5221f]">{errors.code}</span>}
                        </div>
                    )}

                    {/* Description (Program only) */}
                    {type === "program" && (
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-800">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the program..."
                                rows={3}
                                className="w-full rounded-md border border-gray-400/80 px-3.5 py-2.5 text-[15px] focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-full border border-gray-400 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="cursor-pointer rounded-full bg-[#1a63d8] px-7 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5]"
                    >
                        {item ? "Save Changes" : `Create ${TYPE_LABELS[type]}`}
                    </button>
                </div>
            </div>
        </div>
    );
}