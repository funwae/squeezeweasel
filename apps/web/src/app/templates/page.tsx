"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth-client";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      apiClient.setToken(token);
    }

    apiClient
      .listTemplates()
      .then((data) => {
        setTemplates(data.templates);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load templates:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-sw-text-secondary">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-sw-text-primary">Template Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length === 0 ? (
          <p className="text-sw-text-secondary">No templates available.</p>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="border border-sw-border-subtle bg-sw-bg-elevated p-4 rounded-xl hover:border-sw-accent-green-soft transition-colors"
            >
              <h2 className="text-xl font-semibold text-sw-text-primary">
                {template.name}
              </h2>
              {template.description && (
                <p className="text-sw-text-secondary mt-2">{template.description}</p>
              )}
              {template.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-sw-bg border border-sw-border-subtle rounded text-xs text-sw-text-muted">
                  {template.category}
                </span>
              )}
              <div className="mt-4">
                <button className="px-4 py-2 bg-sw-accent-green text-sw-bg rounded-lg font-medium hover:bg-sw-accent-green-soft sw-glow-hover">
                  Install
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

