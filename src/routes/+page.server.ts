export async function load() {
    const res = await fetch("http://localhost:3000/api/stats")
    const data = await res.json()
    return { stats: data }
}