"use server";

export default async function getAdminPassword() {
    return process.env.ADMIN_PASSWORD;
}