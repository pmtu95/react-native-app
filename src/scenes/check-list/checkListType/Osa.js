import React from 'react';
import _ from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import {
    View,
    FlatList,
    Platform,
    Dimensions,
    PermissionsAndroid,
} from 'react-native';
import {
    StyleService,
    useStyleSheet,
    TopNavigation,
    TopNavigationAction,
    ListItem,
    Input,
    Text,
    Toggle,
    Select,
    SelectItem,
    Button,
    ButtonGroup,
    Icon,
    Tab,
    TabView,
    Spinner,
    CheckBox
} from '@ui-kitten/components';
export default function Osa(props) {
    const { details, styles, formData, setFormData, control } = props;
    const [newFormDatas, setNewFormData] = React.useState({
        MS: {
            Available: 0,
            Void: 'Y',
            Note: '',
            Checked: false
        },
        OL: {
            Available: 0,
            Void: 'Y',
            Note: '',
            Checked: false
        }
    });
    React.useEffect(() => {
        setFormData(newFormDatas);
    }, []);
    return <>
        <View style={[styles.itemContainer, styles.rowItem]}>
            <Text style={styles.infoText}>Tồn kho tối thiểu</Text>
            <Text style={styles.valueText}>{details.quantity}</Text>
        </View>

        <View style={[styles.itemContainer, styles.rowItem]}>
            <Text style={styles.infoText}>Barcode</Text>
            <Text style={styles.valueText}>
                {details.custom_attributes.barcode || ''}
            </Text>
        </View>
        {Object.keys(newFormDatas).length ? <>
            {Object.keys(newFormDatas).map((_key, index) => {
                return <>

                    <View style={styles.itemContainer}>
                        <View style={styles.rowItem}>
                            <Text style={styles.infoText}>{_key.toUpperCase()}</Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                    return <>
                                        <CheckBox
                                            checked={value}
                                            onChange={() => {
                                                let newvalue = !value;
                                                let __newFormDatas = { ...newFormDatas };
                                                __newFormDatas[_key].Checked = newvalue;
                                                setNewFormData(__newFormDatas);
                                                setFormData(__newFormDatas);

                                                onChange(newvalue)
                                            }}
                                        >
                                        </CheckBox>
                                    </>
                                }}
                                name={_key + '.Checked'}
                                defaultValue={newFormDatas[_key].Checked}
                            />
                        </View>
                    </View>
                    {newFormDatas[_key].Checked ? <>
                        <View style={styles.itemContainer}>
                            <Text style={[styles.infoText, { marginBottom: 6 }]}>
                                Tồn kho
                            </Text>
                            <Controller
                                control={control}
                                rules={{ required: true, min: 0 }}
                                render={({
                                    field: { onChange, value },
                                    fieldState: { invalid },
                                }) => (
                                    <>
                                        <Input
                                            value={value}
                                            keyboardType="numeric"
                                            onChangeText={val => {
                                                if (val.match(/^\d{0,}(\.\d{0,2})?$/)) {
                                                    onChange(val);
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Available = val;
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }
                                            }}
                                            status={invalid && 'danger'}
                                        />
                                        {invalid && (
                                            <TextError>Cần nhập thông tin!</TextError>
                                        )}
                                    </>
                                )}
                                name={_key + '.Available'}
                                defaultValue={''}
                            />
                        </View>
                        <View style={styles.itemContainer}>
                            <Text style={[styles.infoText, { marginBottom: 6 }]}>
                                Ghi chú
                            </Text>
                            <Controller
                                control={control}
                                rules={{ required: false }}
                                render={({
                                    field: { onChange, value },
                                }) => (
                                    <>
                                        <Input
                                            value={value}
                                            onChangeText={(newvalue) => {
                                                onChange(newvalue);
                                                let __newFormDatas = { ...newFormDatas };
                                                __newFormDatas[_key].Note = newvalue;
                                                setNewFormData(__newFormDatas);
                                                setFormData(__newFormDatas);
                                            }}
                                            multiline
                                            numberOfLines={5}
                                            textAlignVertical="top"
                                            textStyle={{ minHeight: 100 }}
                                        />
                                    </>
                                )}
                                name={_key + '.Note'}
                                defaultValue={newFormDatas[_key].Note}
                            />
                        </View>
                        <View style={styles.itemContainer}>
                            <View style={styles.rowItem}>
                                <Text
                                    style={styles.infoText}
                                    numberOfLines={2}
                                    ellipsizeMode="tail">
                                    Có bảng giá và đúng sản phẩm
                                </Text>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <ButtonGroup size="small" status="basic">
                                            <Button
                                                style={
                                                    (value === 'Y') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('Y');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Void = 'Y';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                Y
                                            </Button>
                                            <Button
                                                style={
                                                    (value === 'N') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('N');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Void = 'N';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                N
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                    name={_key + '.Void'}
                                    defaultValue={newFormDatas[_key].Void}
                                />
                            </View>
                        </View>
                    </> : null}
                </>
            })}
        </> : null}

    </>;
}