"use server";

import { createDatabaseClient } from "@noro/db";
import { requireUser, logtoSessionAdapter } from "@noro/auth";
import { logtoConfig } from "@/lib/logto";
import { revalidatePath } from "next/cache";

export async function listVisaRules(search?: string, continent?: string) {
  const { client, close } = createDatabaseClient();
  try {
    let rows;
    const searchPattern = search ? `%${search}%` : null;

    if (searchPattern && continent) {
      rows = await client`
        SELECT 
          id, country, country_code as "countryCode", flag_emoji as "flagEmoji", 
          region, continent, allowed_stay_days as "allowedStayDays", 
          is_visa_exempt as "isVisaExempt", visa_on_arrival as "visaOnArrival", 
          e_visa_available as "eVisaAvailable", travel_insurance_required as "travelInsuranceRequired", 
          financial_proof_required as "financialProofRequired", min_bank_balance_usd as "minBankBalanceUsd",
          consulate_booking_url as "consulateBookingUrl", official_visa_link as "officialVisaLink", 
          health_info as "healthInfo", data_source as "dataSource", last_verified as "lastVerified"
        FROM vistos.visa_info
        WHERE (country ILIKE ${searchPattern} OR country_code ILIKE ${searchPattern})
          AND continent = ${continent}
        ORDER BY country ASC
      `;
    } else if (searchPattern) {
      rows = await client`
        SELECT 
          id, country, country_code as "countryCode", flag_emoji as "flagEmoji", 
          region, continent, allowed_stay_days as "allowedStayDays", 
          is_visa_exempt as "isVisaExempt", visa_on_arrival as "visaOnArrival", 
          e_visa_available as "eVisaAvailable", travel_insurance_required as "travelInsuranceRequired", 
          financial_proof_required as "financialProofRequired", min_bank_balance_usd as "minBankBalanceUsd",
          consulate_booking_url as "consulateBookingUrl", official_visa_link as "officialVisaLink", 
          health_info as "healthInfo", data_source as "dataSource", last_verified as "lastVerified"
        FROM vistos.visa_info
        WHERE (country ILIKE ${searchPattern} OR country_code ILIKE ${searchPattern})
        ORDER BY country ASC
      `;
    } else if (continent) {
      rows = await client`
        SELECT 
          id, country, country_code as "countryCode", flag_emoji as "flagEmoji", 
          region, continent, allowed_stay_days as "allowedStayDays", 
          is_visa_exempt as "isVisaExempt", visa_on_arrival as "visaOnArrival", 
          e_visa_available as "eVisaAvailable", travel_insurance_required as "travelInsuranceRequired", 
          financial_proof_required as "financialProofRequired", min_bank_balance_usd as "minBankBalanceUsd",
          consulate_booking_url as "consulateBookingUrl", official_visa_link as "officialVisaLink", 
          health_info as "healthInfo", data_source as "dataSource", last_verified as "lastVerified"
        FROM vistos.visa_info
        WHERE continent = ${continent}
        ORDER BY country ASC
      `;
    } else {
      rows = await client`
        SELECT 
          id, country, country_code as "countryCode", flag_emoji as "flagEmoji", 
          region, continent, allowed_stay_days as "allowedStayDays", 
          is_visa_exempt as "isVisaExempt", visa_on_arrival as "visaOnArrival", 
          e_visa_available as "eVisaAvailable", travel_insurance_required as "travelInsuranceRequired", 
          financial_proof_required as "financialProofRequired", min_bank_balance_usd as "minBankBalanceUsd",
          consulate_booking_url as "consulateBookingUrl", official_visa_link as "officialVisaLink", 
          health_info as "healthInfo", data_source as "dataSource", last_verified as "lastVerified"
        FROM vistos.visa_info
        ORDER BY country ASC
      `;
    }

    return rows.map((r: any) => ({
      ...r,
      allowedStayDays: r.allowedStayDays !== null ? Number(r.allowedStayDays) : null,
      minBankBalanceUsd: r.minBankBalanceUsd !== null ? Number(r.minBankBalanceUsd) : null,
      isVisaExempt: Boolean(r.isVisaExempt),
      visaOnArrival: Boolean(r.visaOnArrival),
      eVisaAvailable: Boolean(r.eVisaAvailable),
      travelInsuranceRequired: Boolean(r.travelInsuranceRequired),
      financialProofRequired: Boolean(r.financialProofRequired),
    }));
  } finally {
    await close();
  }
}

export async function updateVisaRuleAction(id: string, updates: any) {
  const { db, client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const adminEmail = userCtx.user.email;
    const adminId = userCtx.user.id;

    const [original] = await client`
      SELECT 
        id, country, country_code, allowed_stay_days, is_visa_exempt, 
        visa_on_arrival, e_visa_available, travel_insurance_required, 
        financial_proof_required, min_bank_balance_usd, consulate_booking_url, 
        official_visa_link, health_info, data_source
      FROM vistos.visa_info 
      WHERE id = ${id}
    `;

    if (!original) {
      throw new Error("Regra de visto não encontrada.");
    }

    const allowedStayDays = updates.allowedStayDays !== undefined ? (updates.allowedStayDays === "" || updates.allowedStayDays === null ? null : Number(updates.allowedStayDays)) : original.allowed_stay_days;
    const isVisaExempt = updates.isVisaExempt !== undefined ? Boolean(updates.isVisaExempt) : original.is_visa_exempt;
    const visaOnArrival = updates.visaOnArrival !== undefined ? Boolean(updates.visaOnArrival) : original.visa_on_arrival;
    const eVisaAvailable = updates.eVisaAvailable !== undefined ? Boolean(updates.eVisaAvailable) : original.e_visa_available;
    const travelInsuranceRequired = updates.travelInsuranceRequired !== undefined ? Boolean(updates.travelInsuranceRequired) : original.travel_insurance_required;
    const financialProofRequired = updates.financialProofRequired !== undefined ? Boolean(updates.financialProofRequired) : original.financial_proof_required;
    const minBankBalanceUsd = updates.minBankBalanceUsd !== undefined ? (updates.minBankBalanceUsd === "" || updates.minBankBalanceUsd === null ? null : Number(updates.minBankBalanceUsd)) : original.min_bank_balance_usd;
    const consulateBookingUrl = updates.consulateBookingUrl !== undefined ? updates.consulateBookingUrl : original.consulate_booking_url;
    const officialVisaLink = updates.officialVisaLink !== undefined ? updates.officialVisaLink : original.official_visa_link;
    const healthInfo = updates.healthInfo !== undefined ? updates.healthInfo : original.health_info;
    const dataSource = updates.dataSource !== undefined ? updates.dataSource : original.data_source;

    await client`
      UPDATE vistos.visa_info
      SET 
        allowed_stay_days = ${allowedStayDays},
        is_visa_exempt = ${isVisaExempt},
        visa_on_arrival = ${visaOnArrival},
        e_visa_available = ${eVisaAvailable},
        travel_insurance_required = ${travelInsuranceRequired},
        financial_proof_required = ${financialProofRequired},
        min_bank_balance_usd = ${minBankBalanceUsd},
        consulate_booking_url = ${consulateBookingUrl},
        official_visa_link = ${officialVisaLink},
        health_info = ${healthInfo ? JSON.stringify(healthInfo) : null},
        data_source = ${dataSource},
        last_verified = now(),
        updated_at = now()
      WHERE id = ${id}
    `;

    const changes: Record<string, { old: any; new: any }> = {};
    const checkDiff = (key: string, oldVal: any, newVal: any) => {
      const oldStr = oldVal === null || oldVal === undefined ? "" : String(oldVal);
      const newStr = newVal === null || newVal === undefined ? "" : String(newVal);
      if (oldStr !== newStr) {
        changes[key] = { old: oldVal, new: newVal };
      }
    };

    checkDiff("allowed_stay_days", original.allowed_stay_days, allowedStayDays);
    checkDiff("is_visa_exempt", original.is_visa_exempt, isVisaExempt);
    checkDiff("visa_on_arrival", original.visa_on_arrival, visaOnArrival);
    checkDiff("e_visa_available", original.e_visa_available, eVisaAvailable);
    checkDiff("travel_insurance_required", original.travel_insurance_required, travelInsuranceRequired);
    checkDiff("financial_proof_required", original.financial_proof_required, financialProofRequired);
    checkDiff("min_bank_balance_usd", original.min_bank_balance_usd, minBankBalanceUsd);
    checkDiff("consulate_booking_url", original.consulate_booking_url, consulateBookingUrl);
    checkDiff("official_visa_link", original.official_visa_link, officialVisaLink);
    checkDiff("data_source", original.data_source, dataSource);

    if (updates.healthInfo !== undefined) {
      checkDiff("health_info", JSON.stringify(original.health_info), JSON.stringify(healthInfo));
    }

    const logDetails = {
      country: original.country,
      country_code: original.country_code,
      admin_email: adminEmail,
      changes
    };

    await client`
      INSERT INTO vistos.admin_activity_log (admin_id, action, entity_type, entity_id, details, created_at)
      VALUES (
        ${adminId}, 
        ${`Atualização catálogo vistos: ${original.country}`}, 
        'visa_info', 
        ${id}, 
        ${JSON.stringify(logDetails)}, 
        now()
      )
    `;

    revalidatePath("/control/vistos");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating visa rule:", err);
    return { success: false, error: err.message || "Erro interno" };
  } finally {
    await close();
  }
}
