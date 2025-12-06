import { apiService, SERVER_BASE_URL } from '@/services/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

interface ImageDiagnosticsProps {
  imageUrls: string[];
  propertyId: string;
}

export const ImageDiagnostics: React.FC<ImageDiagnosticsProps> = ({
  imageUrls,
  propertyId,
}) => {
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, [imageUrls]);

  const runDiagnostics = async () => {
    const results = await Promise.all(
      imageUrls.map(async (url) => {
        const relativePath = url.startsWith('http')
          ? url.replace(SERVER_BASE_URL, '')
          : url;

        const exists = await apiService.checkFileExists(relativePath);

        return {
          originalUrl: url,
          relativePath,
          exists,
          status: exists ? '✅ OK' : '❌ NOT FOUND',
        };
      })
    );

    setDiagnostics(results);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator color="#3b82f6" />
      </View>
    );
  }

  const allExist = diagnostics.every((d) => d.exists);

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: allExist ? '#f0fdf4' : '#fef2f2',
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 8,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          marginBottom: 12,
          color: allExist ? '#16a34a' : '#dc2626',
        }}
      >
        🔍 Image Diagnostics - Property {propertyId}
      </Text>

      <ScrollView nestedScrollEnabled>
        {diagnostics.map((diag, index) => (
          <View
            key={index}
            style={{
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: allExist ? '#dcfce7' : '#fee2e2',
            }}
          >
            <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
              {diag.status}
            </Text>
            <Text style={{ fontSize: 11, color: '#999', fontFamily: 'monospace' }}>
              {diag.relativePath}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Text
        style={{
          fontSize: 12,
          marginTop: 12,
          color: allExist ? '#15803d' : '#991b1b',
        }}
      >
        {allExist
          ? `✅ All ${diagnostics.length} images are available`
          : `❌ ${diagnostics.filter((d) => !d.exists).length}/${diagnostics.length} images not found`}
      </Text>
    </View>
  );
};
