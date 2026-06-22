import { prisma } from './prisma.js';
export const logActivity = async (userId, action, entity, entityId, oldData, newData) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
                newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
            },
        });
    }
    catch (error) {
        console.error("Audit Log Failed:", error);
    }
};
//# sourceMappingURL=auditService.js.map