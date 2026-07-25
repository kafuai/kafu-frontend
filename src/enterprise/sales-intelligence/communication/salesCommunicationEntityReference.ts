import type {
  SalesCommunicationEntityReference,
  SalesCommunicationEntityType,
} from "./salesCommunicationTypes";

const SALES_REFERENCE_PREFIX = "sales-intelligence";

function assertReferencePart(
  name: string,
  value: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(
      `Sales communication ${name} is required.`,
    );
  }

  if (normalized.includes(":")) {
    throw new Error(
      `Sales communication ${name} cannot contain a colon.`,
    );
  }

  return normalized;
}

export function createSalesCommunicationExternalReference(
  entityType: SalesCommunicationEntityType,
  entityId: string,
): string {
  return [
    SALES_REFERENCE_PREFIX,
    assertReferencePart("entity type", entityType),
    assertReferencePart("entity id", entityId),
  ].join(":");
}

export function createSalesCommunicationEntityReference(
  input: {
    readonly companyId: string;
    readonly entityType: SalesCommunicationEntityType;
    readonly entityId: string;
  },
): SalesCommunicationEntityReference {
  const companyId = assertReferencePart(
    "company id",
    input.companyId,
  );

  const entityId = assertReferencePart(
    "entity id",
    input.entityId,
  );

  return {
    companyId,
    entityType: input.entityType,
    entityId,
    externalReferenceId:
      createSalesCommunicationExternalReference(
        input.entityType,
        entityId,
      ),
  };
}

export function parseSalesCommunicationExternalReference(
  externalReferenceId: string,
): Pick<
  SalesCommunicationEntityReference,
  "entityType" | "entityId" | "externalReferenceId"
> | null {
  const [
    prefix,
    entityType,
    entityId,
    ...unexpected
  ] = externalReferenceId.split(":");

  if (
    prefix !== SALES_REFERENCE_PREFIX ||
    !entityType ||
    !entityId ||
    unexpected.length > 0
  ) {
    return null;
  }

  const supportedTypes:
    readonly SalesCommunicationEntityType[] = [
      "lead",
      "opportunity",
      "account",
      "contact",
      "discovery",
      "executive_summary",
    ];

  if (
    !supportedTypes.includes(
      entityType as SalesCommunicationEntityType,
    )
  ) {
    return null;
  }

  return {
    entityType:
      entityType as SalesCommunicationEntityType,
    entityId,
    externalReferenceId,
  };
}

export function isSalesCommunicationExternalReference(
  value: string | undefined,
): boolean {
  return Boolean(
    value &&
      parseSalesCommunicationExternalReference(value),
  );
}
