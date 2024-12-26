import { useEffect, useState } from "react";
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
import { Section, WidgetSettings } from "@/interfaces/widget";
import { updateIndividualAttributes } from "@/app/admin/action";
import { camelToSnakeCase } from "@/lib/utils";

const sections: Section[] = [
  {
    title: "Header",
    elements: [
      {
        type: "editable",
        id: "widgetTitle",
        defaultValue: "What our guests say",
      },
      {
        type: "switch",
        id: "showTabs",
        label: "Show tabs",
      },
    ],
  },
  {
    title: "Review",
    elements: [
      {
        type: "switch",
        id: "showCustomerName",
        label: "Show Name",
      },
      {
        type: "switch",
        id: "showCustomerAvatar",
        label: "Show avatar",
      },
      {
        type: "switch",
        id: "showChannelLogo",
        label: "Show channel logo",
      },
      {
        type: "switch",
        id: "showReviewDate",
        label: "Show Date",
      },
      {
        type: "switch",
        id: "showRating",
        label: "Show Rating",
      },
      {
        type: "select",
        id: "totalReviewsToDisplay",
        label: "Nr of reviews",
        options: [
          { label: "0", value: "0" },
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
          { label: "5", value: "5" },
          { label: "6", value: "6" },
          { label: "7", value: "7" },
          { label: "8", value: "8" },
          { label: "9", value: "9" },
        ],
      },
    ],
  },
  {
    title: "Footer",
    elements: [
      {
        type: "switch",
        id: "showPoweredBy",
        label: "Show powered by",
      },
      {
        type: "editable",
        id: "poweredByText",
        defaultValue: "Powered by Us",
      },
    ],
  },
  {
    title: "Style",
    elements: [
      {
        type: "switch",
        id: "isLightTheme",
        label: "Light",
      },
    ],
  },
];

const SettingsTabs: React.FC = () => {
  const { widget, setWidget } = useWidget();
  const { toast } = useToast();
  const [editStates, setEditStates] = useState<Record<string, boolean>>({});

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({
    widgetTitle: widget?.settings?.widgetTitle ?? "",
    poweredByText: widget?.settings?.poweredByText ?? "",
  });

  useEffect(() => {
    console.log(widget);
  }, [widget]);

  const handleSwitchChange = async (id: string, value: boolean | string) => {
    setWidget((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [id]: value,
      },
    }));

    if (widget && widget?.id) {
      updateWidgetInfoInDb(camelToSnakeCase(id), value);
    }
  };

  const handleEdit = (id: string) => {
    setEditStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleSave = async (id: string, newValue: string) => {
    setFieldValues((prev) => ({ ...prev, [id]: newValue }));

    setWidget((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [id]: newValue,
      },
    }));

    setEditStates((prev) => ({ ...prev, [id]: false }));

    if (widget && widget?.id) {
      updateWidgetInfoInDb(camelToSnakeCase(id), newValue);
    }
  };

  const updateWidgetInfoInDb = async (
    dbAttribute: string,
    updatedValue: string | boolean
  ) => {
    try {
      const response = await updateIndividualAttributes(
        "widgets",
        {
          [dbAttribute]: updatedValue,
        },
        {
          col: "id",
          val: widget?.id,
        }
      );
      const { error } = JSON.parse(response);
      if (!error) {
        toast({ title: "Widget settings updated" });
      } else {
        toast({ title: "Failed to update Widget settings" });
      }
    } catch (error) {
      toast({ title: "Failed to update Widget settings" });
    }
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
            const elementId = element.id;
            switch (element.type) {
              case "switch":
                return (
                  <div key={elementId} className="flex items-center space-x-2">
                    <Switch
                      id={elementId}
                      checked={
                        !!widget?.settings[elementId as keyof WidgetSettings]
                      }
                      onCheckedChange={(value) =>
                        handleSwitchChange(elementId, value)
                      }
                    />
                    <Label htmlFor={elementId} className="font-normal">
                      {element.label}
                    </Label>
                  </div>
                );
              case "editable":
                return (
                  <div key={elementId}>
                    <EditableField
                      isEditing={!!editStates[elementId]}
                      value={fieldValues[elementId] || element.defaultValue}
                      onEdit={() => handleEdit(elementId)}
                      onSave={(newValue) => handleSave(elementId, newValue)}
                      onCancel={() => handleCancel(elementId)}
                      renderValue={<p>{fieldValues[elementId]}</p>}
                    />
                  </div>
                );
              case "select":
                return (
                  <div key={elementId} className="flex items-center space-x-2">
                    <Select
                      onValueChange={(value) =>
                        handleSwitchChange(elementId, value)
                      }
                      value={widget?.settings[
                        elementId as keyof WidgetSettings
                      ].toString()}
                    >
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