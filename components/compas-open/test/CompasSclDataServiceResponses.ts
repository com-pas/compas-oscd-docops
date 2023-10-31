import "@com-pas/compas-open-core/service";
import { SDS_NAMESPACE } from "@com-pas/compas-open-core";

export const BASIC_TYPE_LIST_RESPONSE = `
             <TypeListResponse xmlns="${SDS_NAMESPACE}">
                  <Type>
                      <Code>SED</Code>
                      <Description>System Exchange Description</Description>
                  </Type>
                  <Type>
                      <Code>SSD</Code>
                      <Description>Substation Specification Description</Description>
                  </Type>
             </TypeListResponse>`;

export const BASIC_ITEM_LIST_RESPONSE = `
             <ListResponse xmlns="${SDS_NAMESPACE}">
                <Item>
                    <Id>9883eabb-2e3c-471c-9036-95045d01e3fc</Id>
                    <Name>Station-Utrecht-0001</Name>
                    <Version>2.1.0</Version>
                </Item>
                <Item>
                    <Id>771d8940-9024-4c8b-a103-9566f1ba845e</Id>
                    <Name>Station-Utrecht-0002</Name>
                    <Version>1.3.0</Version>
                </Item>
             </ListResponse>`;
