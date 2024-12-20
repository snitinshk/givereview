"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChannelCardProps {
  logoSrc: string;
  name: string;
  isActive: boolean;
  onToggle: () => void;
  reviewThreshold: string;
  onReviewChange: (value: string) => void;
  disabled: boolean
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  logoSrc,
  name,
  isActive,
  onToggle,
  reviewThreshold,
  onReviewChange,
  disabled
}) => { 

  return (
    <div>
      <div className="flex gap-5 items-center">
        <div className="bg-gray-100 w-80 h-14 rounded-lg p-3 flex items-center">
          <Image
            src={logoSrc}
            alt={`${name} logo`}
            width={40}
            height={40}
            className="rounded-sm"
          />
          <span className="flex-grow text-center font-semibold">{name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor={`${name}-toggle`}>{isActive ? "Active" : "Inactive"}</Label>
          <Switch
            id={`${name}-toggle`}
            checked={isActive}
            onCheckedChange={onToggle}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <span>Show only reviews bigger than</span>
        <Select
          disabled={disabled}
          value={reviewThreshold}
          onValueChange={onReviewChange}
        >
          <SelectTrigger className="min-w-14 w-auto">
            <SelectValue placeholder="number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
        <span>stars</span>
      </div>
    </div>
  );
};

export default ChannelCard;
