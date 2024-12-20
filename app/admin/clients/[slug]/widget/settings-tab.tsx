import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";
import EditableField from "@/components/editable";
import { useWidget } from "@/app/context/widget-context";
import { Section } from "@/interfaces/widget";

const sections: Section[] = [
  {
    title: "Header",
    elements: [
      {
        type: "switch",
        id: "show-title",
        label: "Show title",
      },
      {
        type: "editable",
        id: "header-title",
        defaultValue: "What our guests say",
      },
      {
        type: "switch",
        id: "show-tabs",
        label: "Show tabs",
      },
    ],
  },
  {
    title: "Review",
    elements: [
      {
        type: "switch",
        id: "show-name",
        label: "Show Name",
      },
      {
        type: "switch",
        id: "show-avatar",
        label: "Show avatar",
      },
      {
        type: "switch",
        id: "show-channel-logo",
        label: "Show channel logo",
      },
      {
        type: "switch",
        id: "show-date",
        label: "Show Date",
      },
      {
        type: "switch",
        id: "show-rating",
        label: "Show Rating",
      },
      {
        type: "select",
        id: "review-count",
        label: "Nr of reviews",
        options: [
          { label: "0", value: "0" },
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
          { label: "5", value: "5" },
        ],
      },
    ],
  },
  {
    title: "Footer",
    elements: [
      {
        type: "switch",
        id: "show-powered-by",
        label: "Show powered by",
      },
      {
        type: "editable",
        id: "footer-title",
        defaultValue: "Powered by Us",
      },
    ],
  },
  {
    title: "Style",
    elements: [
      {
        type: "switch",
        id: "style-light",
        label: "Light",
      },
    ],
  },
];

const SettingsTabs: React.FC = () => {
  const { widget, setWidget } = useWidget();
  const [editStates, setEditStates] = useState<Record<string, boolean>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({
    "header-title": "What our guests say",
    "footer-title": "Powered by Us",
  });
  const { toast } = useToast();

  const handleEdit = (id: string) => {
    setEditStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleSave = (id: string, newValue: string) => {
    setFieldValues((prev) => ({ ...prev, [id]: newValue }));
    setEditStates((prev) => ({ ...prev, [id]: false }));
  };

  const handleCancel = (id: string) => {
    setEditStates((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="flex flex-col gap-9">
      {sections.map((section, index) => (
        <div
          key={index}
          className="w-[450px] max-w-full shadow-lg p-6 rounded-xl flex flex-col gap-6"
        >
          <div className="text-[#637381] text-sm uppercase font-bold">
            {section?.title}
          </div>
          {section.elements.map((element) => {
            switch (element.type) {
              case "switch":
                return (
                  <div key={element.id} className="flex items-center space-x-2">
                    <Switch id={element.id} />
                    <Label htmlFor={element.id} className="font-normal">
                      {element.label}
                    </Label>
                  </div>
                );
              case "editable":
                return (
                  <div key={element.id}>
                    <EditableField
                      isEditing={!!editStates[element.id]}
                      value={fieldValues[element.id] || element.defaultValue}
                      onEdit={() => handleEdit(element.id)}
                      onSave={(newValue) => handleSave(element.id, newValue)}
                      onCancel={() => handleCancel(element.id)}
                      renderValue={<p>{fieldValues[element.id]}</p>}
                    />
                  </div>
                );
              case "select":
                return (
                  <div key={element.id} className="flex items-center space-x-2">
                    <Select>
                      <SelectTrigger className="w-[180px] h-12">
                        <SelectValue placeholder={element.label} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {element.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <p>{element.label}</p>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default SettingsTabs;
