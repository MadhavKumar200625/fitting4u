import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";


export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const collection = searchParams.get("collection");
    const status = searchParams.get("status");

    const query = {};
    if (search)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { collectionName: { $regex: search, $options: "i" } },
        { material: { $regex: search, $options: "i" } },
      ];
    if (collection) query.collectionName = collection;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [fabrics, total] = await Promise.all([
      Fabric.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Fabric.countDocuments(query),
    ]);

    return Response.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      fabrics,
    });
  } catch (err) {
    console.error("GET /api/fabrics error:", err);
    return Response.json({ error: "Failed to fetch fabrics" }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.name || !body.slug)
      return Response.json({ error: "Name and slug are required" }, { status: 400 });

    const existing = await Fabric.findOne({ slug: body.slug });
    if (existing)
      return Response.json({ error: "Fabric with this slug already exists" }, { status: 409 });

    const fabric = await Fabric.create(body);

    return Response.json({ success: true, fabric }, { status: 201 });
  } catch (err) {
    console.error("POST /api/fabrics error:", err);
    return Response.json({ error: "Failed to create fabric" }, { status: 500 });
  }
}