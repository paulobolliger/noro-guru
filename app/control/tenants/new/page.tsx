"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function NewTenantPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", slug: "", plan: "starter", billing_email: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/control/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      toast({
        title: "✅ Tenant criado com sucesso!",
        description: `Tenant ${form.name} foi provisionado.`,
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "❌ Erro ao criar tenant",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">Novo Tenant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 rounded bg-white/10 border border-white/20"
          required
        />
        <input
          type="text"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full p-2 rounded bg-white/10 border border-white/20"
          required
        />
        <select
          value={form.plan}
          onChange={(e) => setForm({ ...form, plan: e.target.value })}
          className="w-full p-2 rounded bg-white/10 border border-white/20"
        >
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <input
          type="email"
          placeholder="E-mail de cobranca"
          value={form.billing_email}
          onChange={(e) => setForm({ ...form, billing_email: e.target.value })}
          className="w-full p-2 rounded bg-white/10 border border-white/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded text-white"
        >
          {loading ? "Criando..." : "Criar Tenant"}
        </button>
      </form>
    </div>
  );
}
