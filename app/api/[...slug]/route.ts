import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({ message: "The requested resource was not found." }, { status: 404 });
};

export const POST = async () => {
  return NextResponse.json({ message: "The requested resource was not found." }, { status: 404 });
};

export const PUT = async () => {
  return NextResponse.json({ message: "The requested resource was not found." }, { status: 404 });
};

export const DELETE = async () => {
  return NextResponse.json({ message: "The requested resource was not found." }, { status: 404 });
};

export const PATCH = async () => {
  return NextResponse.json({ message: "The requested resource was not found." }, { status: 404 });
};

export const OPTIONS = async () => {
  return NextResponse.json({ message: "The requested resource was not found." }, { status: 404 });
};

export const HEAD = async () => {
  return NextResponse.json({ message: "The requested resource was not found." }, { status: 404 });
};
