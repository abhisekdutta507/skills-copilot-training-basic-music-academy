'use client';

import { useState } from 'react';
import { courseSchema, courseUpdateSchema } from '@/schemas/course.js';

const CATEGORIES = ['Strings', 'Keys', 'Percussion', 'Wind', 'Vocals'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const BATCHES = ['Weekday', 'Weekend'];

export default function CourseForm({ defaultValues = {}, onSubmit, loading = false, isEdit = false }) {
    const [errors, setErrors] = useState({});

    function handleSubmit(e) {
        e.preventDefault();
        const raw = Object.fromEntries(new FormData(e.target));

        // Coerce types before Zod parse
        const data = {
            ...raw,
            monthlyFee: Number(raw.monthlyFee),
            demoAvailable: raw.demoAvailable === 'true',
        };

        const schema = isEdit ? courseUpdateSchema : courseSchema;
        const result = schema.safeParse(data);

        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        setErrors({});
        onSubmit(result.data);
    }

    return (
        <form onSubmit={handleSubmit} className="row g-3">
            {!isEdit && (
                <div className="col-md-6">
                    <label className="form-label" htmlFor="cf-id">
                        Course ID <span className="text-danger">*</span>
                    </label>
                    <input
                        className={`form-control${errors.id ? ' is-invalid' : ''}`}
                        id="cf-id"
                        name="id"
                        placeholder="e.g. guitar-foundations"
                        defaultValue={defaultValues.id ?? ''}
                    />
                    <div className="form-text">Lowercase letters, numbers, and hyphens only. Used in URLs.</div>
                    {errors.id && <div className="invalid-feedback">{errors.id[0]}</div>}
                </div>
            )}

            <div className={isEdit ? 'col-md-6' : 'col-md-6'}>
                <label className="form-label" htmlFor="cf-name">
                    Name <span className="text-danger">*</span>
                </label>
                <input
                    className={`form-control${errors.name ? ' is-invalid' : ''}`}
                    id="cf-name"
                    name="name"
                    defaultValue={defaultValues.name ?? ''}
                    required
                />
                {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
            </div>

            <div className="col-md-4">
                <label className="form-label" htmlFor="cf-category">Category <span className="text-danger">*</span></label>
                <select
                    className={`form-select${errors.category ? ' is-invalid' : ''}`}
                    id="cf-category"
                    name="category"
                    defaultValue={defaultValues.category ?? ''}
                    required
                >
                    <option value="">Select…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category[0]}</div>}
            </div>

            <div className="col-md-4">
                <label className="form-label" htmlFor="cf-level">Level <span className="text-danger">*</span></label>
                <select
                    className={`form-select${errors.level ? ' is-invalid' : ''}`}
                    id="cf-level"
                    name="level"
                    defaultValue={defaultValues.level ?? ''}
                    required
                >
                    <option value="">Select…</option>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.level && <div className="invalid-feedback">{errors.level[0]}</div>}
            </div>

            <div className="col-md-4">
                <label className="form-label" htmlFor="cf-batch">Batch <span className="text-danger">*</span></label>
                <select
                    className={`form-select${errors.batch ? ' is-invalid' : ''}`}
                    id="cf-batch"
                    name="batch"
                    defaultValue={defaultValues.batch ?? ''}
                    required
                >
                    <option value="">Select…</option>
                    {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.batch && <div className="invalid-feedback">{errors.batch[0]}</div>}
            </div>

            <div className="col-md-4">
                <label className="form-label" htmlFor="cf-fee">Monthly Fee (INR) <span className="text-danger">*</span></label>
                <input
                    className={`form-control${errors.monthlyFee ? ' is-invalid' : ''}`}
                    id="cf-fee"
                    name="monthlyFee"
                    type="number"
                    min="1"
                    defaultValue={defaultValues.monthlyFee ?? ''}
                    required
                />
                {errors.monthlyFee && <div className="invalid-feedback">{errors.monthlyFee[0]}</div>}
            </div>

            <div className="col-md-4">
                <label className="form-label" htmlFor="cf-duration">Duration <span className="text-danger">*</span></label>
                <input
                    className={`form-control${errors.duration ? ' is-invalid' : ''}`}
                    id="cf-duration"
                    name="duration"
                    placeholder="60 min"
                    defaultValue={defaultValues.duration ?? ''}
                    required
                />
                {errors.duration && <div className="invalid-feedback">{errors.duration[0]}</div>}
            </div>

            <div className="col-md-4">
                <label className="form-label" htmlFor="cf-ageGroup">Age Group <span className="text-danger">*</span></label>
                <input
                    className={`form-control${errors.ageGroup ? ' is-invalid' : ''}`}
                    id="cf-ageGroup"
                    name="ageGroup"
                    placeholder="10+ years"
                    defaultValue={defaultValues.ageGroup ?? ''}
                    required
                />
                {errors.ageGroup && <div className="invalid-feedback">{errors.ageGroup[0]}</div>}
            </div>

            <div className="col-12">
                <label className="form-label" htmlFor="cf-schedule">Schedule <span className="text-danger">*</span></label>
                <input
                    className={`form-control${errors.schedule ? ' is-invalid' : ''}`}
                    id="cf-schedule"
                    name="schedule"
                    placeholder="Mon / Wed 4:30 PM"
                    defaultValue={defaultValues.schedule ?? ''}
                    required
                />
                {errors.schedule && <div className="invalid-feedback">{errors.schedule[0]}</div>}
            </div>

            <div className="col-md-6">
                <label className="form-label" htmlFor="cf-instructor">Instructor <span className="text-danger">*</span></label>
                <input
                    className={`form-control${errors.instructor ? ' is-invalid' : ''}`}
                    id="cf-instructor"
                    name="instructor"
                    defaultValue={defaultValues.instructor ?? ''}
                    required
                />
                {errors.instructor && <div className="invalid-feedback">{errors.instructor[0]}</div>}
            </div>

            <div className="col-md-4">
                <label className="form-label" htmlFor="cf-icon">Icon (emoji) <span className="text-danger">*</span></label>
                <input
                    className={`form-control${errors.icon ? ' is-invalid' : ''}`}
                    id="cf-icon"
                    name="icon"
                    placeholder="🎸"
                    defaultValue={defaultValues.icon ?? ''}
                    required
                />
                {errors.icon && <div className="invalid-feedback">{errors.icon[0]}</div>}
            </div>

            <div className="col-md-2">
                <label className="form-label" htmlFor="cf-demo">Demo Available</label>
                <select
                    className="form-select"
                    id="cf-demo"
                    name="demoAvailable"
                    defaultValue={defaultValues.demoAvailable !== undefined ? String(defaultValues.demoAvailable) : 'true'}
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>

            <div className="col-12">
                <label className="form-label" htmlFor="cf-blurb">Blurb <span className="text-danger">*</span></label>
                <textarea
                    className={`form-control${errors.blurb ? ' is-invalid' : ''}`}
                    id="cf-blurb"
                    name="blurb"
                    rows={2}
                    maxLength={300}
                    defaultValue={defaultValues.blurb ?? ''}
                    required
                />
                {errors.blurb && <div className="invalid-feedback">{errors.blurb[0]}</div>}
            </div>

            <div className="col-12">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2" />{isEdit ? 'Saving…' : 'Creating…'}</>
                    ) : (
                        isEdit ? 'Save Changes' : 'Create Course'
                    )}
                </button>
            </div>
        </form>
    );
}
