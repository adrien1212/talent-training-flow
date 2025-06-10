import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '@/services/api';

/**
 * Component to render the signature matrix for a given session.
 *
 * Props:
 *   - sessionId: ID of the session to display
 */
export default function SignatureMatrix({ sessionId }) {
    const [slots, setSlots] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [signedSet, setSignedSet] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        api(`/v1/signatures/signature-matrix/${sessionId}`)
            .then(response => {
                const { slots, enrollments, signatures } = response.data;
                setSlots(slots);
                setEnrollments(enrollments);
                // build lookup set for signed pairs
                const setKeys = new Set(
                    signatures.map(s => `${s.slotId}#${s.enrollmentId}`)
                );
                setSignedSet(setKeys);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load signature matrix');
                setLoading(false);
            });
    }, [sessionId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!slots.length || !enrollments.length) return <div>No data available</div>;

    return (
        <div className="signature-matrix-container">
            <table className="signature-matrix">
                <thead>
                    <tr>
                        <th>Employé \ Créneau</th>
                        {slots.map(slot => (
                            <th key={slot.id}>
                                {slot.date} ({slot.period})
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {enrollments.map(en => (
                        <tr key={en.id}>
                            <td>{en.employeeName}</td>
                            {slots.map(slot => {
                                const key = `${slot.id}#${en.id}`;
                                const signed = signedSet.has(key);
                                return (
                                    <td key={key} className={signed ? 'signed' : 'missing'}>
                                        {signed ? '✔️' : '✖️'}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
        .signature-matrix {
          width: 100%;
          border-collapse: collapse;
        }
        .signature-matrix th,
        .signature-matrix td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: center;
        }
        .signature-matrix th {
          background-color: #f5f5f5;
        }
        .signed {
          background-color: #e0ffe0;
        }
        .missing {
          background-color: #ffe0e0;
        }
      `}</style>
        </div>
    );
}
